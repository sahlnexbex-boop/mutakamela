import type { PageBlock } from './types'

export function createId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36).slice(-4)}`
}

export function cloneDeep<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

/** Find a block by id anywhere in the tree */
export function findBlock(
  blocks: PageBlock[],
  id: string,
): { block: PageBlock; parent: PageBlock[] | null; index: number } | null {
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]
    if (b.id === id) return { block: b, parent: blocks, index: i }
    if (b.children?.length) {
      const found = findBlock(b.children, id)
      if (found) return found
    }
  }
  return null
}

export function updateBlockInTree(
  blocks: PageBlock[],
  id: string,
  updater: (block: PageBlock) => PageBlock,
): PageBlock[] {
  return blocks.map((b) => {
    if (b.id === id) return updater(b)
    if (b.children?.length) {
      return { ...b, children: updateBlockInTree(b.children, id, updater) }
    }
    return b
  })
}

export function removeBlockFromTree(blocks: PageBlock[], id: string): PageBlock[] {
  return blocks
    .filter((b) => b.id !== id)
    .map((b) =>
      b.children?.length
        ? { ...b, children: removeBlockFromTree(b.children, id) }
        : b,
    )
}

export function insertBlock(
  blocks: PageBlock[],
  block: PageBlock,
  parentId: string | null,
  index?: number,
): PageBlock[] {
  if (!parentId) {
    const next = [...blocks]
    if (index === undefined || index < 0 || index > next.length) next.push(block)
    else next.splice(index, 0, block)
    return next
  }

  return blocks.map((b) => {
    if (b.id === parentId) {
      const children = [...(b.children ?? [])]
      if (index === undefined || index < 0 || index > children.length) children.push(block)
      else children.splice(index, 0, block)
      return { ...b, children }
    }
    if (b.children?.length) {
      return { ...b, children: insertBlock(b.children, block, parentId, index) }
    }
    return b
  })
}

export function moveBlock(
  blocks: PageBlock[],
  id: string,
  direction: 'up' | 'down',
): PageBlock[] {
  const found = findBlock(blocks, id)
  if (!found?.parent) return blocks

  const parent = found.parent
  const i = found.index
  const j = direction === 'up' ? i - 1 : i + 1
  if (j < 0 || j >= parent.length) return blocks

  // Mutate a deep clone so we rewrite the full tree immutably
  const clone = cloneDeep(blocks)
  const ref = findBlock(clone, id)
  if (!ref?.parent) return blocks
  const arr = ref.parent
  const a = ref.index
  const b = direction === 'up' ? a - 1 : a + 1
  ;[arr[a], arr[b]] = [arr[b], arr[a]]
  return clone
}

/**
 * Parent id of a block in the tree.
 * - `null` when the block is a top-level root child
 * - `undefined` when the block is not found
 */
export function getParentId(
  blocks: PageBlock[],
  id: string,
): string | null | undefined {
  const walk = (
    list: PageBlock[],
    parentId: string | null,
  ): string | null | undefined => {
    for (const b of list) {
      if (b.id === id) return parentId
      if (b.children?.length) {
        const nested = walk(b.children, b.id)
        if (nested !== undefined) return nested
      }
    }
    return undefined
  }
  return walk(blocks, null)
}

/** True if `maybeDescendantId` is inside `ancestorId`'s subtree (not the ancestor itself). */
export function isDescendant(
  blocks: PageBlock[],
  ancestorId: string,
  maybeDescendantId: string,
): boolean {
  const found = findBlock(blocks, ancestorId)
  if (!found?.block.children?.length) return false
  return !!findBlock(found.block.children, maybeDescendantId)
}

/**
 * Move an existing block to a new parent/index (or reorder within the same parent).
 * `targetParentId = null` means the page root.
 */
export function relocateBlock(
  blocks: PageBlock[],
  blockId: string,
  targetParentId: string | null,
  targetIndex: number,
): PageBlock[] {
  const found = findBlock(blocks, blockId)
  if (!found) return blocks

  // Cannot drop onto self as a parent
  if (targetParentId === blockId) return blocks
  // Cannot drop into own descendants
  if (targetParentId && isDescendant(blocks, blockId, targetParentId)) {
    return blocks
  }

  const sourceParentId = getParentId(blocks, blockId)
  if (sourceParentId === undefined) return blocks

  let insertIndex = targetIndex
  if (sourceParentId === targetParentId && found.index < targetIndex) {
    insertIndex = targetIndex - 1
  }

  // No-op when already at the same slot
  if (sourceParentId === targetParentId && insertIndex === found.index) {
    return blocks
  }

  const blockCopy = cloneDeep(found.block)
  const without = removeBlockFromTree(blocks, blockId)
  return insertBlock(without, blockCopy, targetParentId, Math.max(0, insertIndex))
}

export function duplicateBlock(blocks: PageBlock[], id: string): PageBlock[] {
  const found = findBlock(blocks, id)
  if (!found?.parent) return blocks

  const clone = cloneDeep(blocks)
  const ref = findBlock(clone, id)
  if (!ref?.parent) return blocks

  const copy = reIdBlock(cloneDeep(ref.block))
  ref.parent.splice(ref.index + 1, 0, copy)
  return clone
}

function reIdBlock(block: PageBlock): PageBlock {
  return {
    ...block,
    id: createId(block.type),
    children: block.children?.map(reIdBlock),
  }
}

export function spacingToCss(box?: Partial<{ top: number; right: number; bottom: number; left: number }>) {
  if (!box) return undefined
  const t = box.top ?? 0
  const r = box.right ?? 0
  const b = box.bottom ?? 0
  const l = box.left ?? 0
  return `${t}px ${r}px ${b}px ${l}px`
}

export function normalizePageContent(raw: unknown): import('./types').PageContent {
  if (raw && typeof raw === 'object' && Array.isArray((raw as { blocks?: unknown }).blocks)) {
    return raw as import('./types').PageContent
  }
  return { version: 1, blocks: [] }
}

export function normalizeFormSchema(raw: unknown): import('./types').FormSchema {
  if (raw && typeof raw === 'object' && Array.isArray((raw as { sections?: unknown }).sections)) {
    return raw as import('./types').FormSchema
  }
  return { version: 1, sections: [] }
}
