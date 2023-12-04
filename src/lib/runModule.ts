export default async function runModule(path: string) {
  const module = await import(`../${path}`);
  await module.default();
}
