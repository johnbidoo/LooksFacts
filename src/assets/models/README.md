# 3D product models (optional)

Product pages show an interactive 3D model. By default each product uses a
procedurally generated packaging model (jar, tube, dropper, bottle or pump)
based on its category.

To use a real model for a product, add a GLB file named after the product ID
(see `../products/README.md` for the full ID list):

    cerave-moisturising-cream.glb

It replaces the generated model automatically — it is scaled to fit,
centred and given the same studio lighting and shadow.

Guidelines:

- Format: binary glTF (`.glb`), Y-up, metres or any consistent unit
- Keep each file under ~2 MB; compress with Draco or Meshopt
  (e.g. `npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt`)
- Textures: 2048 px max, WebP or KTX2 where possible
- Only add models you have the rights to use (brand-supplied, commissioned
  or your own scans/modelling)
