import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import './index.css'
import { TRPCProvider } from "@/providers/trpc"
import App from './App.tsx'

/**
 * HashRouter is used for static deployments where we cannot
 * configure NGINX try_files. The hash-based URL format
 * (/#/talent, /#/employer) ensures the server never sees
 * client-side routes — eliminating 404 errors entirely.
 *
 * When transitioning to self-hosted NGINX, switch to
 * BrowserRouter and deploy the included nginx.conf.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <TRPCProvider>
        <App />
      </TRPCProvider>
    </HashRouter>
  </StrictMode>,
)
