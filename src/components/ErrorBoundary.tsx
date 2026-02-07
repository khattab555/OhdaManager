import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">حدث خطأ غير متوقع (Something went wrong)</h1>
            <div className="bg-red-50 p-4 rounded border border-red-200 mb-4 overflow-auto max-h-60">
              <p className="font-mono text-sm text-red-800 font-bold">{this.state.error?.toString()}</p>
              <pre className="font-mono text-xs text-red-600 mt-2 whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              مسح البيانات وإعادة التشغيل (Clear Data & Reload)
            </button>
            <p className="text-xs text-gray-500 mt-2">
              * سيؤدي هذا الزر إلى مسح جميع البيانات المحلية لحل المشكلة.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}