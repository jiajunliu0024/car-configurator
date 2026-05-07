# Project Structure

This project is a React + Vite 3D car wrap showroom. The page presents a white showroom-style interface with a fixed 3D car viewer, top model dropdown, and bottom horizontal wrap color scroller.

## High-Level Flow

1. `src/main.jsx` mounts the React app.
2. `src/App.jsx` renders the showroom page.
3. `src/components/CarViewer.jsx` owns the page layout, selected car model, selected wrap color, and 3D canvas.
4. `src/components/CarModel.jsx` loads GLB files and applies the selected wrap material.
5. `src/assets/data.jsx` defines available car models and wrap colors.
6. `src/index.css` controls the white showroom layout and responsive styling.

## Directory Map

```txt
CARS -Starter/
  AGENTS.md
  docs/
    PROJECT_STRUCTURE.md
  scripts/
    compress-models.sh
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
      CarModel.jsx
      LoadingFallback.jsx
      models/
        tesla_2018_model_3.glb
        2024_byd_seal.glb
        2025_bmw_m4_competition.glb
        audi_rs5.glb
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

- Renders the top car model dropdown so more vehicle models can be added without crowding the header.
- Renders a bottom horizontal wrap color strip so users can swipe/scroll through many colors.
- Tracks the currently selected car model.
- Tracks wrap color per car model so each model can keep its own selected wrap.
- Checks whether the selected GLB file exists.
- Rejects HTML fallback responses so missing model paths do not crash `useGLTF`.
- Renders the React Three Fiber `<Canvas>`.
- Uses showroom lighting, `Environment`, `ContactShadows`, and `OrbitControls`.
- Uses `OrbitControls` with `makeDefault`, a fixed `target`, damping, bounded zoom distance, and explicit mouse/touch mappings for rotate + zoom.
- Disables pan so the model stays centered, while allowing bounded zoom for closer inspection and explicit mouse/touch rotation controls. The viewer CSS uses `touch-action: none`, non-interactive overlays use `pointer-events: none`, and dropdown/drawer containers only enable pointer events on their actual controls so display layers do not steal rotation drags.
- Shows the placeholder car when the GLB file is missing.
- The previous bottom info cards were removed to keep a cleaner showroom layout.

### `src/components/CarModel.jsx`

3D model and material logic.

- Loads GLB files using `useGLTF`.
- Clones the loaded scene before applying materials.
- Uses a strict paint selection rule: only mesh/material names ending with `paint` are treated as paintable targets.
- Keeps strict `*paint` naming as first priority, then applies small model-specific fallback token rules for legacy GLB naming (Tesla/BMW/Audi/BYD) so wrap recoloring still works before Blender naming is fully standardized.
- Creates high-quality solid wrap materials with `MeshPhysicalMaterial`.
- Creates gradient wraps with a simple normal-based `ShaderMaterial`.
- Exports `PlaceholderCar` for preview mode when real GLB files are absent.
- Auto-fits each model and aligns the model bottom to the showroom ground plane to avoid floating.
- Model placement logic:
  - Compute world-space bounding box from cloned scene.
  - `scale = 4.2 / max(size.x, size.y, size.z)` to normalize different source model sizes.
  - Center in X/Z using `-center.x * scale` and `-center.z * scale`.
  - Ground alignment uses `-box.min.y * scale + groundY`.
  - Default `groundY` is `-1.12`, with per-model override support (currently Tesla has a custom offset) because different GLB exports can have different pivot/origin and lowest-vertex definitions.

### `src/components/LoadingFallback.jsx`

Small loading indicator rendered inside the 3D canvas while a GLB is loading.

### `src/assets/data.jsx`

Static showroom configuration.

- `carModels`: model id, display name, description, and GLB path.
- `wrapColors`: wrap id, label, swatch color, material tuning values, and special material flags such as `gradient`.

Current runtime imports use `src/components/models/*.glb` as Vite asset URLs.

### `src/index.css`

Global CSS and showroom styling.

- White showroom background.
- Top centered model dropdown.
- Bottom semi-transparent wrap strip with horizontal scrolling for many color options.
- Fixed-size central viewer.
- Responsive layout for smaller screens.
- On phone widths, the model dropdown becomes full-width at the top, the viewer occupies more vertical space, and the bottom wrap strip remains swipeable.

### `public/models/`

Place user-provided GLB files here.

Current runtime models:

```txt
src/components/models/*.glb
```

Optional public model files can also be placed here for future expansion:

```txt
public/models/*.glb
```

If a configured file does not exist, the app uses the placeholder 3D car instead of crashing.

## Update Rules

When changing code, keep this document in sync.

- If a file is added, removed, renamed, or repurposed, update `Directory Map` and `File Responsibilities`.
- If model paths or wrap options change, update `src/assets/data.jsx` details in this document.
- If page layout changes, update the `src/components/CarViewer.jsx` and `src/index.css` sections.
- If 3D loading/material behavior changes, update the `src/components/CarModel.jsx` section.
- If new utility scripts are added, update `Directory Map` and mention usage context.
