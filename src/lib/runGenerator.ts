import { GeneratorInput, GeneratorFunction } from "../interfaces/generator.ts";

/** Executes an executer Function from the given ts file (file at path) */
export default async function runGenerator(
  generatorPath: string,
  input: GeneratorInput,
) {
  const generator = await import(`../${generatorPath}`);
  const generatorFunction = generator.default as GeneratorFunction;
  return await generatorFunction(input);
}
