# Project Structure

This project is a React + Vite 3D car wrap showroom. The page presents a white showroom-style interface with a fixed 3D car viewer, top model selector, and left-side wrap color selector.

## High-Level Flow

1. `src/main.jsx` mounts the React app.
2. `src/App.jsx` renders the showroom page.
3. `src/components/CarViewer.jsx` owns the page layout, selected car model, selected wrap color, and 3D canvas.
4. `src/components/models/CarModel.jsx` loads GLB files and applies the selected wrap material.
5. `src/assets/data.jsx` defines available car models and wrap colors.
6. `src/index.css` controls the white showroom layout and responsive styling.

## Directory Map

```txt
CARS -Starter/
  AGENTS.md
  docs/
    PROJECT_STRUCTURE.md
  public/
    models/
      car.glb              # optional user-provided model path
      byd-seal.glb         # optional model path configured in data.jsx
      volvo-ex30.glb       # optional model path configured in data.jsx
  src/
    App.jsx
    main.jsx
    index.css
    assets/
      data.jsx
    components/
      CarViewer.jsx
      LoadingFallback.jsx
      models/
        CarModel.jsx
        tesla_2018_model_3.glb
  package.json
  vite.config.js
```

## File Responsibilities

### `src/main.jsx`

Vite entry point. It imports global styles from `src/index.css` and mounts `App` into `#root`.

### `src/App.jsx`

Small app shell. It renders only `CarViewer`, keeping page-level logic out of the entry point.

### `src/components/CarViewer.jsx`

Main showroom component.

- Renders the top car model selector.
- Renders the left wrap color selector.
- Tracks the currently selected car model.
- Tracks wrap color per car model so each model can keep its own selected wrap.
- Checks whether the selected GLB file exists.
- Rejects HTML fallback responses so missing model paths do not crash `useGLTF`.
- Renders the React Three Fiber `<Canvas>`.
- Uses showroom lighting, `Environment`, `ContactShadows`, and `OrbitControls`.
- Disables pan and zoom so the model stays visually fixed while still allowing rotation.
- Shows the placeholder car when the GLB file is missing.

### `src/components/models/CarModel.jsx`

3D model and material logic.

- Loads GLB files using `useGLTF`.
- Clones the loaded scene before applying materials.
- Finds car body meshes by paint material names first, especially `primary`, `primary.001`, `primary.002`, and other `primary.*` materials used by the Tesla GLB.
- Also matches mesh/material names such as `body`, `paint`, `carpaint`, `bodywork`, `shell`, `door`, `hood`, `bumper`, `roof`, or similar panel names.
- Skips non-wrap parts such as wheels, tires, glass, lights, interior, grille, chrome, badges, and plates using token-based matching so names like `primary` are not accidentally excluded by the `rim` token.
- If no named body mesh exists, applies material to all wrap candidates so split body panels change together.
- If that fails, applies material to all meshes.
- Creates high-quality wrap materials with `MeshPhysicalMaterial`.
- Creates the gradient wrap with a simple `ShaderMaterial`.
- Exports `PlaceholderCar` for preview mode when real GLB files are absent.

### `src/components/LoadingFallback.jsx`

Small loading indicator rendered inside the 3D canvas while a GLB is loading.

### `src/assets/data.jsx`

Static showroom configuration.

- `carModels`: model id, display name, description, and GLB path.
- `wrapColors`: wrap id, label, swatch color, and material tuning values.

The default configured model imports `src/components/models/tesla_2018_model_3.glb` as a Vite asset URL. Update this file when adding new car models or wrap options.

### `src/index.css`

Global CSS and showroom styling.

- White showroom background.
- Top centered model tabs.
- Left fixed color sidebar.
- Fixed-size central viewer.
- Bottom detail cards.
- Responsive layout for smaller screens.
- On phone widths, model tabs become a compact horizontal top scroller, wrap colors move into a bottom touch-friendly swatch rail, the viewer is centered in the available middle area, and detail cards become compact.

### `public/models/`

Place user-provided GLB files here.

Current bundled model:

```txt
src/components/models/tesla_2018_model_3.glb
```

Optional public model files can also be placed here:

```txt
public/models/car.glb
```

Additional configured paths:

```txt
public/models/byd-seal.glb
public/models/volvo-ex30.glb
```

If a configured file does not exist, the app uses the placeholder 3D car instead of crashing.

## Update Rules

When changing code, keep this document in sync.

- If a file is added, removed, renamed, or repurposed, update `Directory Map` and `File Responsibilities`.
- If model paths or wrap options change, update `src/assets/data.jsx` details in this document.
- If page layout changes, update the `src/components/CarViewer.jsx` and `src/index.css` sections.
- If 3D loading/material behavior changes, update the `src/components/models/CarModel.jsx` section.
