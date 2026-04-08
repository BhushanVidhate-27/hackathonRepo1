import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router";

export function ErrorPage() {
  const err = useRouteError() as any;

  let title = "Something went wrong";
  let details: string | null = null;

  if (isRouteErrorResponse(err)) {
    title = `${err.status} ${err.statusText}`;
    details = typeof err.data === "string" ? err.data : JSON.stringify(err.data, null, 2);
  } else if (err instanceof Error) {
    title = err.message || title;
    details = err.stack || null;
  } else if (err) {
    details = String(err);
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white border border-gray-200 rounded-xl p-6">
        <div className="text-xl text-[#0A2540] mb-2">{title}</div>
        <div className="text-sm text-gray-600 mb-4">
          If you see this, the app hit a runtime error instead of rendering a blank screen.
        </div>
        {details && (
          <pre className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-auto">
            {details}
          </pre>
        )}
      </div>
    </div>
  );
}

