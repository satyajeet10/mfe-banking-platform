import { Component, Suspense, lazy, type ComponentType, type ReactNode } from 'react';

interface Props {
  name: string;
  load: () => Promise<{ default: ComponentType }>;
}

/**
 * Loads a remote MFE lazily and isolates its failures.
 * If a remote's server is down or its code throws, only that region shows a fallback —
 * the rest of the shell keeps working. "Retry" re-creates the lazy import.
 */
export class RemoteBoundary extends Component<Props, { error: Error | null; attempt: number }> {
  state = { error: null as Error | null, attempt: 0 };
  private Remote = lazy(this.props.load);

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  private retry = () => {
    this.Remote = lazy(this.props.load);
    this.setState((s) => ({ error: null, attempt: s.attempt + 1 }));
  };

  render(): ReactNode {
    const { name } = this.props;
    if (this.state.error) {
      return (
        <div className="remote-fallback" role="alert">
          <p>{name} is temporarily unavailable. Other services still work.</p>
          <button type="button" onClick={this.retry}>Retry</button>
        </div>
      );
    }
    const Remote = this.Remote;
    return (
      <Suspense fallback={<div className="remote-loading" aria-busy="true">Loading {name}…</div>}>
        <Remote key={this.state.attempt} />
      </Suspense>
    );
  }
}
