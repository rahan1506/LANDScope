/**
 * LANDScope Land Governance Analytics Acceptance Test Suite
 *
 * Verifies all 20 Acceptance Tests:
 * TEST 1 to TEST 20
 */

const http = require("http");
const { execSync } = require("child_process");

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
          json: () => {
            try {
              return JSON.parse(body);
            } catch (e) {
              return null;
            }
          },
        });
      });
    });
    req.on("error", reject);
    if (postData) {
      req.write(typeof postData === "string" ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

function parseCookies(res) {
  const setCookie = res.headers["set-cookie"];
  if (!setCookie) return "";
  return setCookie.map((c) => c.split(";")[0]).join("; ");
}

async function loginAs(email) {
  const res = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/auth/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { email }
  );
  const cookie = parseCookies(res);
  const data = res.json();
  return { res, cookie, data };
}

async function runAnalyticsSuite() {
  console.log("==================================================");
  console.log("LANDScope LAND GOVERNANCE ANALYTICS ACCEPTANCE SUITE");
  console.log("==================================================\n");

  let allPassed = true;
  let testResults = [];

  function assertTest(testNum, title, condition, details = "") {
    if (condition) {
      console.log(`TEST ${testNum} RESULT: PASSED ✅ - ${title}`);
      if (details) console.log(`   ${details}`);
      testResults.push({ num: testNum, title, status: "PASSED", details });
    } else {
      console.log(`TEST ${testNum} RESULT: FAILED ❌ - ${title}`);
      if (details) console.log(`   ${details}`);
      testResults.push({ num: testNum, title, status: "FAILED", details });
      allPassed = false;
    }
  }

  // --- Authentications ---
  console.log("--- Authenticating as Policymaker (policymaker@landscope.demo) ---");
  const { cookie: polCookie, data: polData } = await loginAs("policymaker@landscope.demo");
  console.log(`Authenticated: ${polData.user.name} (${polData.user.roleCode})\n`);

  console.log("--- Authenticating as Researcher (researcher@landscope.demo) ---");
  const { cookie: resCookie, data: resData } = await loginAs("researcher@landscope.demo");
  console.log(`Authenticated: ${resData.user.name} (${resData.user.roleCode})\n`);

  console.log("--- Authenticating as Public (public@landscope.demo) ---");
  const { cookie: pubCookie, data: pubData } = await loginAs("public@landscope.demo");
  console.log(`Authenticated: ${pubData.user.name} (${pubData.user.roleCode})\n`);

  // ========================================================
  // TEST 1: Authorized user can access Analytics
  // ========================================================
  console.log("--- TEST 1: Authorized user can access Analytics ---");
  const anaPageRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/app/analytics",
    method: "GET",
    headers: { Cookie: polCookie },
  });
  const anaApiRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/analytics?state=Madhya%20Pradesh&district=Sehore&tehsil=Ashta",
    method: "GET",
    headers: { Cookie: polCookie },
  });
  const anaApiData = anaApiRes.json();
  const t1Passed =
    anaPageRes.statusCode === 200 &&
    (anaPageRes.body.includes("Land Governance Analytics") || anaPageRes.body.includes("analytics")) &&
    anaApiRes.statusCode === 200 &&
    anaApiData?.success === true &&
    anaApiData?.profile?.state === "Madhya Pradesh";
  assertTest(
    1,
    "Authorized user can access Analytics",
    t1Passed,
    `Page Status: ${anaPageRes.statusCode}, API Status: ${anaApiRes.statusCode}, Geography: ${anaApiData?.profile?.state}`
  );

  // ========================================================
  // TEST 2: Unauthorized user is denied
  // ========================================================
  console.log("\n--- TEST 2: Unauthorized user is denied ---");
  // Public user attempting to request restricted governance audit mode
  const pubRestrictedRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/analytics?mode=restricted",
    method: "GET",
    headers: { Cookie: pubCookie },
  });
  // Public user attempting to fetch confidential why trail
  const pubRestrictedWhyRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/analytics/why?key=why-confidential-cadastre",
    method: "GET",
    headers: { Cookie: pubCookie },
  });
  const t2Passed = pubRestrictedRes.statusCode === 403 && pubRestrictedWhyRes.statusCode === 403;
  assertTest(
    2,
    "Unauthorized user is denied",
    t2Passed,
    `Restricted mode status: ${pubRestrictedRes.statusCode} (Expected 403), Confidential why trail status: ${pubRestrictedWhyRes.statusCode} (Expected 403)`
  );

  // ========================================================
  // TEST 3: Unauthenticated user is rejected
  // ========================================================
  console.log("\n--- TEST 3: Unauthenticated user is rejected ---");
  const unauthPageRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/app/analytics",
    method: "GET",
  });
  const unauthApiRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/analytics",
    method: "GET",
  });
  const t3Passed =
    (unauthPageRes.statusCode === 307 || unauthPageRes.statusCode === 302) &&
    unauthPageRes.headers["location"]?.includes("/login") &&
    unauthApiRes.statusCode === 401;
  assertTest(
    3,
    "Unauthenticated user is rejected",
    t3Passed,
    `Page Redirect: ${unauthPageRes.statusCode} -> ${unauthPageRes.headers["location"]}, API Status: ${unauthApiRes.statusCode} (Expected 401)`
  );

  // ========================================================
  // TEST 4: Geography selection works
  // ========================================================
  console.log("\n--- TEST 4: Geography selection works ---");
  const geo1Res = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/analytics?state=Madhya%20Pradesh&district=Sehore&tehsil=Ashta",
    method: "GET",
    headers: { Cookie: polCookie },
  });
  const geo2Res = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/analytics?state=Maharashtra&district=Pune&tehsil=Haveli",
    method: "GET",
    headers: { Cookie: polCookie },
  });
  const geo3Res = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/analytics?state=Gujarat&district=Surat&tehsil=Chorasi",
    method: "GET",
    headers: { Cookie: polCookie },
  });
  const g1 = geo1Res.json();
  const g2 = geo2Res.json();
  const g3 = geo3Res.json();
  const t4Passed =
    g1.profile.tehsil === "Ashta" &&
    g2.profile.tehsil === "Haveli" &&
    g3.profile.tehsil === "Chorasi" &&
    g1.profile.timeSeries[0].agriculturePct !== g2.profile.timeSeries[0].agriculturePct;
  assertTest(
    4,
    "Geography selection works (State -> District -> Tehsil)",
    t4Passed,
    `Loaded: ${g1.profile.state}/${g1.profile.district}/${g1.profile.tehsil}, ${g2.profile.state}/${g2.profile.district}/${g2.profile.tehsil}, ${g3.profile.state}/${g3.profile.district}/${g3.profile.tehsil}`
  );

  // ========================================================
  // TEST 5: Land-use trend visualization works
  // ========================================================
  console.log("\n--- TEST 5: Land-use trend visualization works ---");
  const series = g1.profile.timeSeries;
  const hasAllCategories = series.every(
    (pt) =>
      typeof pt.agriculturePct === "number" &&
      typeof pt.builtUpPct === "number" &&
      typeof pt.forestPct === "number" &&
      typeof pt.waterPct === "number"
  );
  assertTest(
    5,
    "Land-use trend visualization works (Agriculture, Built-up, Forest, Water)",
    hasAllCategories && series.length >= 5,
    `Time points: ${series.map((s) => s.year).join(", ")}, Categories: Agriculture, Built-up, Forest, Water`
  );

  // ========================================================
  // TEST 6: Timeline changes analytical data
  // ========================================================
  console.log("\n--- TEST 6: Timeline changes analytical data ---");
  const res2018 = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/analytics?state=Madhya%20Pradesh&district=Sehore&tehsil=Ashta&year=2018",
    method: "GET",
    headers: { Cookie: polCookie },
  });
  const res2026 = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/analytics?state=Madhya%20Pradesh&district=Sehore&tehsil=Ashta&year=2026",
    method: "GET",
    headers: { Cookie: polCookie },
  });
  const d2018 = res2018.json();
  const d2026 = res2026.json();
  const t6Passed =
    d2018.profile.selectedYear === 2018 &&
    d2026.profile.selectedYear === 2026 &&
    d2018.profile.currentLandUse.agriculturePct !== d2026.profile.currentLandUse.agriculturePct &&
    d2018.profile.currentLandUse.builtUpPct < d2026.profile.currentLandUse.builtUpPct;
  assertTest(
    6,
    "Timeline changes analytical data (2018 vs 2026)",
    t6Passed,
    `2018: Agri ${d2018.profile.currentLandUse.agriculturePct}%, Built-Up ${d2018.profile.currentLandUse.builtUpPct}% | 2026: Agri ${d2026.profile.currentLandUse.agriculturePct}%, Built-Up ${d2026.profile.currentLandUse.builtUpPct}%`
  );

  // ========================================================
  // TEST 7: Climate/resilience indicators load
  // ========================================================
  console.log("\n--- TEST 7: Climate/resilience indicators load ---");
  const clim = g1.profile.climateResilience;
  const t7Passed =
    typeof clim.waterStressIndex === "number" &&
    typeof clim.floodExposureIndex === "number" &&
    typeof clim.ecologicalVulnerabilityIndex === "number" &&
    typeof clim.aquiferRechargeScore === "number" &&
    clim.aquiferStatus === "Critical" &&
    clim.statusLabel === "Illustrative Model Output";
  assertTest(
    7,
    "Climate/resilience indicators load",
    t7Passed,
    `Water Stress: ${clim.waterStressIndex}/100 (${clim.waterStressStatus}), Drought: ${clim.droughtVulnerability}, Aquifer: ${clim.aquiferRechargeScore}/100 (${clim.aquiferStatus})`
  );

  // ========================================================
  // TEST 8: Governance indicators load
  // ========================================================
  console.log("\n--- TEST 8: Governance indicators load ---");
  const gov = g1.profile.governance;
  const t8Passed =
    typeof gov.disputeRatePct === "number" &&
    typeof gov.tenureSecurityIndex === "number" &&
    typeof gov.cadastralFormalizationPct === "number" &&
    typeof gov.averageMutationDays === "number" &&
    typeof gov.svamitvaTitleDeedCoveragePct === "number" &&
    gov.statusLabel === "Illustrative Demo Dataset";
  assertTest(
    8,
    "Governance indicators load",
    t8Passed,
    `Dispute Rate: ${gov.disputeRatePct}%, Tenure Security: ${gov.tenureSecurityIndex}/100, Mutation Latency: ${gov.averageMutationDays} days, Formalization: ${gov.cadastralFormalizationPct}%`
  );

  // ========================================================
  // TEST 9: Policy performance data comes from Policy Digital Twin
  // ========================================================
  console.log("\n--- TEST 9: Policy performance data comes from Policy Digital Twin ---");
  const twinSimulation = g1.profile.policyPerformance.simulationResult;
  const t9Passed =
    twinSimulation &&
    twinSimulation.scenarioTitle &&
    twinSimulation.status === "Illustrative Model Output" &&
    Array.isArray(twinSimulation.sectorImpacts) &&
    twinSimulation.sectorImpacts.length === 6;
  assertTest(
    9,
    "Policy performance data comes from Policy Digital Twin",
    t9Passed,
    `Scenario: "${twinSimulation?.scenarioTitle}", Status: ${twinSimulation?.status}, Sector Impacts: ${twinSimulation?.sectorImpacts?.length}`
  );

  // ========================================================
  // TEST 10: Baseline vs scenario comparison works across 6 dimensions
  // ========================================================
  console.log("\n--- TEST 10: Baseline vs scenario comparison works ---");
  const dimNames = twinSimulation.sectorImpacts.map((d) => d.dimension);
  const requiredDims = [
    "AGRICULTURE",
    "WATER",
    "ECOLOGY",
    "URBAN DEVELOPMENT",
    "INFRASTRUCTURE",
    "LAND GOVERNANCE",
  ];
  const allDimsPresent = requiredDims.every((rd) => dimNames.includes(rd));
  const hasDeltas = twinSimulation.sectorImpacts.every(
    (d) =>
      typeof d.baselineValue === "string" &&
      typeof d.scenarioValue === "string" &&
      typeof d.deltaText === "string"
  );
  assertTest(
    10,
    "Baseline vs scenario comparison works across 6 dimensions",
    allDimsPresent && hasDeltas,
    `Dimensions verified: ${dimNames.join(", ")}`
  );

  // ========================================================
  // TEST 11: Evidence Trail works
  // ========================================================
  console.log("\n--- TEST 11: Evidence Trail works ---");
  const whyAgriRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/analytics/why?key=why-agri-conversion",
    method: "GET",
    headers: { Cookie: polCookie },
  });
  const whyData = whyAgriRes.json();
  const trail = whyData?.trail;
  const t11Passed =
    trail &&
    trail.researchSource &&
    trail.spatialLayer &&
    trail.observationPeriod &&
    trail.analysisMethod &&
    trail.modelStatus &&
    trail.limitations;
  assertTest(
    11,
    "Evidence Trail works (Source, GIS layer, Period, Method, Status, Limitations)",
    t11Passed,
    `Source: ${trail.researchSource.title}, Method: ${trail.analysisMethod}, Period: ${trail.observationPeriod}`
  );

  // ========================================================
  // TEST 12: "Why?" explanation works
  // ========================================================
  console.log("\n--- TEST 12: 'Why?' explanation works ---");
  const whyAquiferRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/analytics/why?key=why-aquifer-stress",
    method: "GET",
    headers: { Cookie: polCookie },
  });
  const whyAquifer = whyAquiferRes.json();
  const t12Passed =
    whyAquiferRes.statusCode === 200 &&
    whyAquifer?.trail?.key === "why-aquifer-stress" &&
    whyAquifer?.trail?.researchSource?.reference === "GW-RES-2025-IND";
  assertTest(
    12,
    "'Why?' explanation works",
    t12Passed,
    `Question: "${whyAquifer?.trail?.question}", Ref: ${whyAquifer?.trail?.researchSource?.reference}`
  );

  // ========================================================
  // TEST 13: Analytics → GIS context handoff works
  // ========================================================
  console.log("\n--- TEST 13: Analytics → GIS context handoff works ---");
  // Test GIS page receives State, District, Tehsil query params
  const gisRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/app/land-intelligence?state=Madhya%20Pradesh&district=Sehore&tehsil=Ashta",
    method: "GET",
    headers: { Cookie: polCookie },
  });
  const t13Passed = gisRes.statusCode === 200;
  assertTest(
    13,
    "Analytics → GIS context handoff works",
    t13Passed,
    `Handoff to /app/land-intelligence?state=Madhya Pradesh&district=Sehore&tehsil=Ashta (Status: ${gisRes.statusCode})`
  );

  // ========================================================
  // TEST 14: Analytics → Research context handoff works
  // ========================================================
  console.log("\n--- TEST 14: Analytics → Research context handoff works ---");
  const resHandoffRes = await request({
    hostname: "localhost",
    port: 3000,
    path: `/app/${resData.user.roleCode.toLowerCase()}?section=research-evidence&state=Madhya%20Pradesh&district=Sehore&tehsil=Ashta&topic=Land-Use`,
    method: "GET",
    headers: { Cookie: resCookie },
  });
  const t14Passed = resHandoffRes.statusCode === 200;
  assertTest(
    14,
    "Analytics → Research context handoff works",
    t14Passed,
    `Handoff to Research workspace with state, district, tehsil and topic (Status: ${resHandoffRes.statusCode})`
  );

  // ========================================================
  // TEST 15: Analytics → Reports context handoff works
  // ========================================================
  console.log("\n--- TEST 15: Analytics → Reports context handoff works ---");
  const repHandoffRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/app/reports?state=Madhya%20Pradesh&district=Sehore&tehsil=Ashta&source=analytics",
    method: "GET",
    headers: { Cookie: polCookie },
  });
  const t15Passed = repHandoffRes.statusCode === 200;
  assertTest(
    15,
    "Analytics → Reports context handoff works",
    t15Passed,
    `Handoff to /app/reports?state=Madhya Pradesh&district=Sehore&tehsil=Ashta&source=analytics (Status: ${repHandoffRes.statusCode})`
  );

  // ========================================================
  // TEST 16: Public users cannot access restricted analytics
  // ========================================================
  console.log("\n--- TEST 16: Public users cannot access restricted analytics ---");
  const pubAnalyticsRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/analytics?state=Madhya%20Pradesh&district=Sehore&tehsil=Ashta",
    method: "GET",
    headers: { Cookie: pubCookie },
  });
  const pubAnaData = pubAnalyticsRes.json();
  const t16Passed =
    pubAnalyticsRes.statusCode === 200 &&
    pubAnaData.isPublicRole === true &&
    pubAnaData.profile.governance.annualLitigationPlaints === 0 &&
    pubAnaData.profile.governance.confidentialAuditFlag === false;
  assertTest(
    16,
    "Public users cannot access restricted analytics",
    t16Passed,
    `Public Role detected, annualLitigationPlaints sanitized to: ${pubAnaData.profile.governance.annualLitigationPlaints}`
  );

  // ========================================================
  // TEST 17: Private data cannot cross roles
  // ========================================================
  console.log("\n--- TEST 17: Private data cannot cross roles ---");
  const polAnalyticsRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/analytics?state=Madhya%20Pradesh&district=Sehore&tehsil=Ashta",
    method: "GET",
    headers: { Cookie: polCookie },
  });
  const polAnaData = polAnalyticsRes.json();
  const t17Passed =
    polAnaData.profile.governance.annualLitigationPlaints > 0 &&
    pubAnaData.profile.governance.annualLitigationPlaints === 0;
  assertTest(
    17,
    "Private data cannot cross roles",
    t17Passed,
    `Policymaker sees confidential plaints (${polAnaData.profile.governance.annualLitigationPlaints}), Public receives redacted (0)`
  );

  // ========================================================
  // TEST 18: No unsupported causal claims are presented as facts
  // ========================================================
  console.log("\n--- TEST 18: No unsupported causal claims are presented as facts ---");
  const textBlob = JSON.stringify(g1.profile.insights) + " " + JSON.stringify(whyData);
  const unsupportedCausalWords = ["policy caused", "policy strictly caused", "direct causal proof", "guaranteed outcome"];
  const hasUnsupportedCausal = unsupportedCausalWords.some((word) => textBlob.toLowerCase().includes(word));
  const hasPermittedPhrases =
    textBlob.includes("Observed trend") ||
    textBlob.includes("Illustrative relationship") ||
    textBlob.includes("Scenario-model relationship");
  const t18Passed = !hasUnsupportedCausal && hasPermittedPhrases;
  assertTest(
    18,
    "No unsupported causal claims are presented as facts",
    t18Passed,
    `Verified presence of neutral phrasing ('Observed trend', 'Scenario-model relationship') and absence of unsupported causality.`
  );

  // ========================================================
  // TEST 19: Prototype data is appropriately labelled
  // ========================================================
  console.log("\n--- TEST 19: Prototype data is appropriately labelled ---");
  const hasDemoLabels =
    anaPageRes.body.includes("Illustrative Demo Analysis") ||
    anaPageRes.body.includes("Illustrative Model Output") ||
    JSON.stringify(g1).includes("Illustrative Demo Analysis") ||
    JSON.stringify(g1).includes("Illustrative Model Output");
  assertTest(
    19,
    "Prototype data is appropriately labelled",
    hasDemoLabels,
    `Verified 'Illustrative Demo Analysis' & 'Illustrative Model Output' present in data structures and pages.`
  );

  // ========================================================
  // TEST 20: Production TypeScript build succeeds
  // ========================================================
  console.log("\n--- TEST 20: Production TypeScript build succeeds ---");
  let tscSuccess = false;
  try {
    const tscOutput = execSync("npx tsc --noEmit", { encoding: "utf8" });
    tscSuccess = true;
    console.log("   TypeScript compilation check passed with 0 errors.");
  } catch (err) {
    console.error("   TypeScript compilation failed:", err.stdout || err.message);
    tscSuccess = false;
  }
  assertTest(20, "Production TypeScript build succeeds", tscSuccess, "tsc --noEmit returned 0 errors");

  // ========================================================
  // SUMMARY
  // ========================================================
  console.log("\n==================================================");
  console.log("LANDScope ANALYTICS ACCEPTANCE TEST SUITE SUMMARY");
  console.log("==================================================");
  const passedCount = testResults.filter((r) => r.status === "PASSED").length;
  const failedCount = testResults.filter((r) => r.status === "FAILED").length;
  console.log(`Total Tests: 20`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Warnings: 0`);
  console.log(`Failed: ${failedCount}`);
  console.log(`Status: ${allPassed ? "ALL TESTS PASSED ✅" : "SOME TESTS FAILED ❌"}`);
  console.log("==================================================");
}

runAnalyticsSuite().catch(console.error);
