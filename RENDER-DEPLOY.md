# Render frontend deployment

This app uses TanStack Start. The default build targets a server/Cloudflare runtime,
not a Vite `dist` static site. Use the dedicated Render SPA build for Static Sites.

## Existing Render Static Site

Commit and push `package.json`, `vite.render.config.ts`, and this deployment configuration
to the frontend repository connected to Render. In the existing service settings:

- Build Command: `npm ci && npm run build:render`
- Publish Directory: `dist/client`
- Root Directory: leave empty if `package.json` is at the frontend repository root.
  If deploying the combined workspace repository, use `oculist-hub`.
- Environment: set `VITE_API_BASE_URL` to your deployed backend's HTTPS URL with
  `/api/v1`, for example `https://YOUR-BACKEND.onrender.com/api/v1`.
- Redirects/Rewrites: Source `/*`, Destination `/index.html`, Action **Rewrite**.

Save changes and deploy the latest commit. Environment values are bundled during
build, so changing the API URL requires rebuilding. Do not use localhost for the
hosted API URL.

On the backend, set `CORS_ORIGIN` to the actual frontend origin, for example
`https://YOUR-FRONTEND.onrender.com`, then redeploy the backend if it changed.

`render.yaml` can also create a Static Site through Render Blueprints. Adding it
alone does not update a previously configured dashboard-managed site.

## Verification

Run `npm run build:render`. Confirm `dist/client/index.html` and
`dist/client/assets` exist. Only publish `dist/client`; the server directory
is used for build-time shell generation, not deployed to the Static Site.

After deployment, check `/login`, sign in, and refresh a nested URL such as
`/patients/new`. Confirm API requests use your deployed backend URL.

References:
- https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode
- https://render.com/docs/static-sites
- https://render.com/docs/redirects-rewrites
