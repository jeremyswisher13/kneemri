import { describe, expect, it } from "vitest";
import {
  NORMAL_MRI_MODE_PARAM,
  normalWorkstationResumePath,
  readNormalParam,
} from "@/lib/normal-workstation-url";

describe("normal workstation URL state", () => {
  it("restores only allowed mode and series params", () => {
    expect(readNormalParam("?mode=caq", NORMAL_MRI_MODE_PARAM, ["explore", "caq"], "explore")).toBe(
      "caq",
    );
    expect(readNormalParam("?mode=adjust", NORMAL_MRI_MODE_PARAM, ["explore", "caq"], "explore")).toBe(
      "explore",
    );
  });

  it("adds mode and series to resume paths while preserving other query params", () => {
    expect(
      normalWorkstationResumePath({
        pathname: "/courses/elbow-mri/normal-elbow-mri",
        search: "?pwaQa=1",
        hash: "#top",
        modeId: "caq",
        seriesId: "axial",
      }),
    ).toBe("/courses/elbow-mri/normal-elbow-mri?pwaQa=1&mode=caq&series=axial#top");
    expect(
      normalWorkstationResumePath({
        pathname: "/courses/elbow-mri/normal-elbow-mri",
        search: "?mode=explore&series=coronal",
        hash: "",
        modeId: "tour",
        seriesId: "sagittal",
      }),
    ).toBe("/courses/elbow-mri/normal-elbow-mri?mode=tour&series=sagittal");
  });
});
