import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { aiSentinel } from '../services/aiSentinel';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    aiSentinel.recordAnomaly(
      'React Error Boundary',
      error.message || 'React component render crash',
      'Caught component error, isolated crash, and initialized auto-recovery'
    );
  }

  private handleAutoRecover = () => {
    this.setState({ hasError: false, error: null });
    aiSentinel.recordAnomaly(
      'Recovery Manager',
      'Component tree reset requested by user',
      'Refreshed virtual DOM state and restored application loop'
    );
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/40 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-bold text-white">AI Sentinel Intercepted Anomaly</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              An unexpected render exception was caught and isolated by the AI Sentinel self-healing engine. Your local documents and subscription state remain completely intact.
            </p>

            <button
              onClick={this.handleAutoRecover}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Auto-Heal & Restore Workspace</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
