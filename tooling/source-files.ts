export interface SourceFile {
  readonly path: string
  readonly source: string
}

export const collectSourceFiles = async (
  directory: string,
  extensions?: readonly string[],
): Promise<readonly SourceFile[]> => {
  const files: SourceFile[] = []
  const visit = async (path: string): Promise<void> => {
    for await (const entry of Deno.readDir(path)) {
      const child = `${path}/${entry.name}`
      if (entry.isDirectory) await visit(child)
      else if (
        entry.isFile &&
        (extensions === undefined || extensions.some((extension) => entry.name.endsWith(extension)))
      ) {
        files.push({ path: child.replaceAll("\\", "/"), source: await Deno.readTextFile(child) })
      }
    }
  }

  try {
    await visit(directory)
  } catch (cause) {
    if (!(cause instanceof Deno.errors.NotFound)) throw cause
  }
  return files
}
