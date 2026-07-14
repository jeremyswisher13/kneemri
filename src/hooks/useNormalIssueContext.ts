import { useCallback, useEffect, useMemo, useState } from "react";
import { useIssueReportContext } from "@/contexts/IssueReportContext";
import type { IssuePageContext } from "@/lib/issue-report";

export type NormalIssueDetail = Pick<IssuePageContext, "sliceIndex" | "landmark" | "itemId">;

export function useNormalIssueContext({
  mode,
  modeLabel,
  seriesId,
  seriesLabel,
  startIndex,
}: {
  mode: string;
  modeLabel: string;
  seriesId: string;
  seriesLabel: string;
  startIndex: number;
}) {
  const { setPageContext, clearPageContext } = useIssueReportContext();
  const activeKey = `${mode}:${seriesId}`;
  const [storedDetail, setStoredDetail] = useState<{
    key: string;
    value: NormalIssueDetail;
  }>({ key: activeKey, value: { sliceIndex: startIndex } });
  const detail = storedDetail.key === activeKey ? storedDetail.value : { sliceIndex: startIndex };
  const updateDetail = useCallback((next: NormalIssueDetail) => {
    setStoredDetail((current) =>
      current.key === activeKey && JSON.stringify(current.value) === JSON.stringify(next)
        ? current
        : { key: activeKey, value: next },
    );
  }, [activeKey]);

  const pageContext = useMemo<IssuePageContext>(
    () => ({
      pageKind: "normal-mri",
      mode: modeLabel,
      seriesId,
      seriesLabel,
      sliceIndex: detail.sliceIndex ?? null,
      landmark: detail.landmark ?? null,
      itemId: detail.itemId ?? null,
    }),
    [detail.itemId, detail.landmark, detail.sliceIndex, modeLabel, seriesId, seriesLabel],
  );

  useEffect(() => {
    setPageContext(pageContext);
  }, [pageContext, setPageContext]);

  useEffect(() => () => clearPageContext(), [clearPageContext]);

  const onSliceChange = useCallback(
    (sliceIndex: number) => updateDetail({ sliceIndex }),
    [updateDetail],
  );

  return { onContextChange: updateDetail, onSliceChange };
}
