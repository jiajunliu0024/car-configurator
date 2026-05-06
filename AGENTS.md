# Cursor Agent Brief: Car Wrap MVP 3D

## Goal

Build a minimal 3D car wrap MVP web app that:

- Loads high-quality GLB car models.
- Allows the user to rotate and inspect the selected model.
- Allows switching wrap materials on the selected car.
- Supports different car models receiving different wrap materials.
- Feels like a premium automotive showroom. Visual quality is the top priority.

The current repository is a React + Vite app with Tailwind CSS, `three`, `@react-three/fiber`, and `@react-three/drei` already installed. Build inside this existing structure. Do not migrate to Next.js or TypeScript unless the user explicitly asks.

## Current Repo Structure

Use this structure for the current Vite app:

```txt
src/
  App.jsx
  index.css
  components/
    CarViewer.jsx
    LoadingFallback.jsx
    models/
      CarModel.jsx
  assets/
    data.jsx
public/
  models/
    car.glb
    ...
  hdr/
    studio.hdr
```

`src/App.jsx` should become the page shell. `src/components/CarViewer.jsx` should own the canvas, controls, selected model, selected material, and UI buttons. `src/components/models/CarModel.jsx` should load the selected GLB and apply the selected material. Reuse `src/assets/data.jsx` for car labels/model metadata if useful.

If `studio.hdr` is missing, use high-quality basic lights and keep the app working. Do not block the MVP on the HDR file.

## Core Requirements

### 1. Scene Setup

- Render one 3D viewer on `/`.
- Use a perspective camera.
- Add orbit controls with rotate enabled.
- Disable pan if it makes the experience cleaner.
- Zoom can be enabled or disabled, but keep the camera easy to use.
- Set a premium showroom background with dark/neutral tones, subtle gradients, and high contrast around the vehicle.

Use React Three Fiber/Drei for this repo:

- `<Canvas>`
- `<OrbitControls>` or `<PresentationControls>`
- `<Environment>` for showroom reflections when possible.
- `<ContactShadows>` or a lightweight floor shadow for grounded showroom quality.

### 2. Lighting

Lighting should feel premium and make wrap materials look high quality.

- Prefer local HDR environment lighting from `public/hdr/studio.hdr` when available.
- Add `hemisphereLight`, `directionalLight`, or both for readable highlights.
- Tune lights so metallic and glossy wraps show reflections clearly.
- If HDR is missing, use multiple simple lights to approximate a studio setup.

### 3. Model Loading And Model Selection

- Load GLB models from `public/models/` with `useGLTF` from `@react-three/drei`.
- Start with `/models/car.glb` as the default model.
- If there are multiple `.glb` or `.gltf` files, expose a minimal model selector so the user can switch between car models.
- If no model exists yet, create code assuming `/models/car.glb` and show a helpful note telling the user where to place the file.
- Preload the default model. Preload other models only when it does not hurt startup too much.
- Traverse the loaded `scene` and find the car body mesh:
  - Prefer mesh names that include `body`, `paint`, `carpaint`, `bodywork`, or similar.
  - If no clear body mesh exists, use the largest mesh.
  - If that still fails, apply the selected material to all meshes.

### 4. Material System

Implement high-quality wrap materials. Start with these 3 core materials, but structure the code so more wraps can be added easily.

Matte:

- `MeshStandardMaterial`
- color `#111111`
- metalness `0.1`
- roughness `0.9`
- High-quality satin/matte appearance.

Metallic:

- `MeshStandardMaterial`
- color `#c0c0c0`
- metalness `0.8`
- roughness `0.3`
- Clear studio reflections.

Gradient:

- Simple `ShaderMaterial`
- Mix purple to blue based on normal direction.
- Use `vNormal` in the fragment shader.
- Keep the shader short and readable.
- Should feel like a premium color-shift wrap, not a flat placeholder.

Optional extra wraps are allowed if simple and high impact:

- Gloss Black
- Pearl White
- Chrome/Silver
- Satin Red

### 5. Material Switching

Create a function equivalent to:

```js
applyMaterial(type) // "matte" | "metallic" | "gradient"
```

When the user clicks a button:

- Replace `carBody.material`.
- If no body mesh was found, replace materials on all car meshes.
- Material changes should appear instantly.
- Track material per selected car model if multiple models are available, so each car can keep its own chosen wrap while switching models.

### 6. Minimal UI

The UI should be minimal but showroom-quality:

- Model selector if more than one GLB is available.
- Material buttons: Matte, Metallic, Gradient, plus optional extra premium wraps.
- Active state for the selected material.
- Active state for the selected model.
- Buttons at bottom center, in a glass panel, side panel, or below the canvas.
- Short title such as "Car Wrap Studio".
- Optional static pricing/payment preview if requested.

Keep the interface clean, premium, and custom. No heavy UI libraries.

### 7. Performance

- Set `dpr={[1, 2]}` on `<Canvas>`.
- Use sensible high-quality settings without making the browser struggle.
- Avoid unnecessary React re-renders while the scene is running.
- Keep shaders short and targeted.
- Use optional slow auto-rotate only if it feels polished.
- Avoid physics and unnecessary effects.
- Do not add large extra assets unless they directly improve showroom quality.

### 8. Canvas Handling

- Let React Three Fiber `<Canvas>` own the renderer lifecycle.
- Keep all canvas code inside `CarViewer.jsx`.
- Keep model-loading code inside `components/models/CarModel.jsx`.

## Optional Nice To Have

- Slow auto rotate.
- Loading spinner while the model loads.
- Basic contact shadow or floor plane.
- Model selector for multiple cars.
- Extra premium wrap swatches.
- Static pricing/payment preview section only if the user asks for it.

## Payments Scope

Payments are display-only only.

If a payments area is needed, build only a static presentation section, such as:

- Pricing card
- Deposit/reservation amount
- Payment method labels
- "Reserve Now" or "Continue" button with no real payment action
- Visual checkout summary

Do not implement:

- Real payment processing
- Stripe, PayPal, Square, or other payment SDKs
- Payment forms that collect card numbers
- Backend payment APIs
- User checkout state or order persistence

## Acceptance Criteria

The MVP is done when:

- `npm run dev` starts without runtime errors.
- The landing page renders without a blank screen.
- The GLB model loads from `public/models/car.glb` when present.
- The user can rotate the car.
- The user can click Matte, Metallic, and Gradient.
- The car body material changes instantly.
- If no clear body mesh is found, the material applies to all meshes.
- If multiple car models exist, the user can switch models.
- Different car models can have different selected wrap materials.
- The viewer has premium showroom lighting, reflections, and presentation.
- The page remains reasonably performant while prioritizing visual quality.
- `npm run build` succeeds.

## Commands To Use

```bash
npm install
npm run dev
npm run build
```

Run `npm run lint` if code changes are substantial and fix straightforward issues.

## Keep It Minimal

The first MVP should not include:

- User accounts
- Real payments or payment integrations
- Backend APIs
- Complex color pickers
- Backend-managed inventory
- Advanced animation timelines
- Global state management
- External heavy UI libraries
- Music/audio features unless explicitly requested

Focus on a premium car wrap showroom: high-quality GLB viewing, multiple car models when available, and convincing wrap material changes.
