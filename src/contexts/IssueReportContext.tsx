/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { IssuePageContext } from "@/lib/issue-report";

interface IssueReportContextValue {
  pageContext: IssuePageContext;
  setPageContext: (context: IssuePageContext) => void;
  clearPageContext: () => void;
}

const IssueReportContext = createContext<IssueReportContextValue>({
  pageContext: {},
  setPageContext: () => {},
  clearPageContext: () => {},
});

function contextKey(context: IssuePageContext) {
  return JSON.stringify(context);
}

export function IssueReportProvider({ children }: { children: ReactNode }) {
  const [pageContext, setPageContextState] = useState<IssuePageContext>({});
  const setPageContext = useCallback((next: IssuePageContext) => {
    setPageContextState((current) => (contextKey(current) === contextKey(next) ? current : next));
  }, []);
  const clearPageContext = useCallback(() => setPageContextState({}), []);
  const value = useMemo(
    () => ({ pageContext, setPageContext, clearPageContext }),
    [clearPageContext, pageContext, setPageContext],
  );
  return <IssueReportContext.Provider value={value}>{children}</IssueReportContext.Provider>;
}

export function useIssueReportContext() {
  return useContext(IssueReportContext);
}

