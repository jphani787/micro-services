import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { getServiceConfig, servicesConfig } from "../config/services";

const router = Router();

function createServerProxy(
  targetUrl: string,
  pathRewrite?: Record<string, string>
): any {
  const options = {
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: pathRewrite || {},
    timeout: 30000,
    proxyTimeout: 30000,
    onError: (err: any, req: any, res: any) => {
      console.error("Proxy error:", err.message);
      if (!res.headersSent) {
        res.status(503).json({
          success: false,
          error: "Service unavailable, Please try again later",
          message: "Service unavailable, Please try again later",
        });
      }
    },
    onProxyReq: (proxyReq: any, req: any) => {
      console.log(
        `Proxying request to: ${req.method} ${req.originalUrl} to ${targetUrl}`
      );

      if (req.user) {
        proxyReq.setHeader("x-user-id", req.user.userId);
        proxyReq.setHeader("x-user-email", req.user.email);
      }

      if (
        (req.body && req.method === "POST") ||
        req.method === "PUT" ||
        req.method === "PATCH"
      ) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onProxyRes: (proxyRes: any, req: any, res: any) => {
      console.log(
        `Received response from: ${targetUrl}: ${proxyRes.statusCode} for ${req.method} ${req.originalUrl}`
      );
    },
  };

  return createProxyMiddleware(options);
}

router.use(
  "/api/auth",
  createServerProxy(servicesConfig.auth.url, {
    "^/api/auth": "/auth",
  })
);

router.use(
  "/api/users",
  createServerProxy(servicesConfig.users.url, {
    "^/api/users": "/users",
  })
);

router.use(
  "/api/notes",
  createServerProxy(servicesConfig.notes.url, {
    "^/api/notes": "/notes",
  })
);

// router.use(
//   "/api/tags",
//   createServerProxy(servicesConfig.tags.url, {
//     "^/api/tags": "/tags",
//   })
// );

export default router;
