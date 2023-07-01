import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

const name = 'tiled-property-flattener'

const bundle = config => ({
  ...config,
  input: 'src/tiled_property_flattener.ts',
  external: id => !/^[./]/.test(id),
})

export default [
  bundle({
    plugins: [esbuild()],
    output: [
      {
        file: `dist/${name}.js`,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: `dist/${name}.mjs`,
        format: 'es',
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `dist/${name}.d.ts`,
      format: 'es',
    },
  }),
]