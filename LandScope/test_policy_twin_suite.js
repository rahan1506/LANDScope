/**
 * LANDScope POLICY DIGITAL TWIN ACCEPTANCE TEST SUITE (SIH26019)
 *
 * Verifies all 20 acceptance criteria:
 * TEST 1: Authorized policymaker can access Policy Lab.
 * TEST 2: Unauthorized public user cannot access Policy Lab.
 * TEST 3: Researcher access follows configured permissions.
 * TEST 4: Geography passed from GIS appears correctly.
 * TEST 5: Baseline data loads.
 * TEST 6: Scenario can be created.
 * TEST 7: Policy parameters can be changed.
 * TEST 8: Scenario simulation executes.
 * TEST 9: Baseline vs scenario comparison works.
 * TEST 10: Multi-dimensional impact results appear.
 * TEST 11: Trade-offs appear.
 * TEST 12: Evidence can be attached.
 * TEST 13: WHY / Evidence Trace opens.
 * TEST 14: Alternative scenarios can be compared.
 * TEST 15: Stress test works.
 * TEST 16: Policy context can be passed to Reports.
 * TEST 17: Policy context can link back to Research.
 * TEST 18: Private scenarios cannot be accessed by unauthorized users.
 * TEST 19: Unauthenticated users cannot access Policy Lab.
 * TEST 20: No synthetic result is presented as an official government forecast.
 */

const BASE_URL = "http://localhost:3000";

async function login(email, password = "landscope2026") {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const cookieHeader = res.headers.get("set-cookie");
  let cookie = "";
  if (cookieHeader) {
    const match = cookieHeader.match(/landscope_session_token=[^;]+/);
    if (match) cookie = match[0];
  }

  const json = await res.json();
  return { status: res.status, data: json, cookie };
}

async function runPolicyTwinSuite() {
  console.log("==================================================");
  console.log("LANDScope POLICY DIGITAL TWIN ACCEPTANCE TEST SUITE");
  console.log("==================================================\n");

  let allPassed = true;

  // 1. Authenticate as Policymaker
  console.log("--- Authenticating as Policymaker (policymaker@landscope.demo) ---");
  const policymakerAuth = await login("policymaker@landscope.demo");
  if (!policymakerAuth.cookie) {
    console.error("FATAL: Could not login as policymaker.");
    process.exit(1);
  }
  console.log(`Authenticated: ${policymakerAuth.data.user.name} (${policymakerAuth.data.user.roleCode})\n`);

  // TEST 1: Authorized policymaker can access Policy Lab
  console.log("--- TEST 1: Authorized policymaker can access Policy Lab ---");
  try {
    const res = await fetch(`${BASE_URL}/app/policy-lab`, {
      headers: { Cookie: policymakerAuth.cookie },
    });
    const html = await res.text();
    const hasTitle = html.includes("Policy Digital Twin Lab");
    const isDenied = html.includes("Restricted Workspace") || html.includes("Access Denied");

    console.log(`HTTP Status: ${res.status}`);
    console.log(`Has Title: ${hasTitle}, Access Denied: ${isDenied}`);

    if (res.status === 200 && hasTitle && !isDenied) {
      console.log("TEST 1 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 1 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 1 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 2: Unauthorized public user cannot access Policy Lab
  console.log("--- TEST 2: Unauthorized public user cannot access Policy Lab ---");
  try {
    const publicAuth = await login("public@landscope.demo");
    const pageRes = await fetch(`${BASE_URL}/app/policy-lab`, {
      headers: { Cookie: publicAuth.cookie },
    });
    const html = await pageRes.text();
    const hasAccessDenied = html.includes("Restricted Workspace") || html.includes("Access Denied");

    const apiRes = await fetch(`${BASE_URL}/api/policy/scenarios`, {
      headers: { Cookie: publicAuth.cookie },
    });

    console.log(`Page Status: ${pageRes.status}, Access Denied: ${hasAccessDenied}`);
    console.log(`API Status for Public: ${apiRes.status} (Expected: 403 Forbidden)`);

    if (hasAccessDenied && apiRes.status === 403) {
      console.log("TEST 2 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 2 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 2 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 3: Researcher access follows configured permissions
  console.log("--- TEST 3: Researcher access follows configured permissions ---");
  try {
    const researcherAuth = await login("researcher@landscope.demo");
    // Researcher does NOT have policy:read by default; should be blocked from policy scenarios
    const apiRes = await fetch(`${BASE_URL}/api/policy/scenarios`, {
      headers: { Cookie: researcherAuth.cookie },
    });
    console.log(`API Status for Researcher: ${apiRes.status} (Expected: 403 Forbidden)`);

    if (apiRes.status === 403) {
      console.log("TEST 3 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 3 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 3 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 4: Geography passed from GIS appears correctly
  console.log("--- TEST 4: Geography passed from GIS appears correctly ---");
  try {
    const res = await fetch(`${BASE_URL}/app/policy-lab?state=Madhya%20Pradesh&district=Sehore&tehsil=Ashta`, {
      headers: { Cookie: policymakerAuth.cookie },
    });
    const html = await res.text();
    const hasGeography = html.includes("Ashta Tehsil, Sehore, Madhya Pradesh") || html.includes("Sehore, Madhya Pradesh");

    console.log(`Geography correctly preserved from GIS: ${hasGeography}`);

    if (res.status === 200 && hasGeography) {
      console.log("TEST 4 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 4 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 4 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 5: Baseline data loads
  console.log("--- TEST 5: Baseline data loads ---");
  try {
    const res = await fetch(`${BASE_URL}/api/policy/simulate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: policymakerAuth.cookie,
      },
      body: JSON.stringify({
        state: "Madhya Pradesh",
        district: "Sehore",
        tehsil: "Ashta",
      }),
    });
    const data = await res.json();
    const base = data.baseline;

    console.log(`Baseline Agriculture: ${base.landUse.agriculturePct}%`);
    console.log(`Baseline Aquifer Recharge Index: ${base.environment.aquiferRechargeIndex} / 100 (${base.environment.aquiferStatus})`);
    console.log(`Baseline Cadastral Formalization: ${base.governance.cadastralFormalizationPct}%`);

    if (base && base.landUse.agriculturePct === 52.1 && base.environment.aquiferStatus === "Critical") {
      console.log("TEST 5 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 5 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 5 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 6: Scenario can be created
  console.log("--- TEST 6: Scenario can be created ---");
  let createdScenarioId = "";
  try {
    const res = await fetch(`${BASE_URL}/api/policy/scenarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: policymakerAuth.cookie,
      },
      body: JSON.stringify({
        title: "Controlled Peri-Urban Agro-Preservation Scenario",
        category: "Land-Use Planning",
        geography: "Sehore, Madhya Pradesh",
        parameters: {
          "param-agri-cap": 600,
          "param-eco-buffer": 800,
        },
      }),
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Created Scenario ID: ${data.scenario?.id}`);
    console.log(`Scenario Title: ${data.scenario?.title}`);

    if (res.status === 201 && data.success && data.scenario?.id) {
      createdScenarioId = data.scenario.id;
      console.log("TEST 6 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 6 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 6 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 7: Policy parameters can be changed
  console.log("--- TEST 7: Policy parameters can be changed ---");
  try {
    // Run simulation with modified parameters
    const res = await fetch(`${BASE_URL}/api/policy/simulate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: policymakerAuth.cookie,
      },
      body: JSON.stringify({
        parameters: {
          "param-agri-cap": 400, // stricter ceiling
          "param-eco-buffer": 1000, // deeper buffer
        },
      }),
    });
    const data = await res.json();
    const agriImpact = data.simulationResult.sectorImpacts.find((s) => s.dimension === "AGRICULTURE");

    console.log(`Modified Cap (400 Ha) -> Result: ${agriImpact.headlineMetric} (${agriImpact.scenarioValue})`);

    if (agriImpact && agriImpact.scenarioValue.includes("400 Ha")) {
      console.log("TEST 7 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 7 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 7 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 8: Scenario simulation executes
  console.log("--- TEST 8: Scenario simulation executes ---");
  try {
    const res = await fetch(`${BASE_URL}/api/policy/simulate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: policymakerAuth.cookie,
      },
      body: JSON.stringify({
        scenarioTitle: "Test Simulation Run",
      }),
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Simulation Status: ${data.simulationResult.status}`);
    console.log(`Horizon: ${data.simulationResult.horizonYear}`);

    if (res.status === 200 && data.simulationResult && data.simulationResult.status === "Illustrative Model Output") {
      console.log("TEST 8 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 8 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 8 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 9: Baseline vs scenario comparison works
  console.log("--- TEST 9: Baseline vs scenario comparison works ---");
  try {
    const res = await fetch(`${BASE_URL}/api/policy/simulate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: policymakerAuth.cookie,
      },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    const impacts = data.simulationResult.sectorImpacts;
    const hasBaseline = impacts.every((i) => i.baselineValue && i.scenarioValue && i.deltaText);

    console.log(`All sector impacts compare Baseline vs Scenario: ${hasBaseline}`);
    impacts.forEach((i) => {
      console.log(`  [${i.dimension}] Baseline: ${i.baselineValue} vs Scenario: ${i.scenarioValue} (${i.deltaText})`);
    });

    if (hasBaseline) {
      console.log("TEST 9 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 9 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 9 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 10: Multi-dimensional impact results appear
  console.log("--- TEST 10: Multi-dimensional impact results appear ---");
  try {
    const res = await fetch(`${BASE_URL}/api/policy/simulate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: policymakerAuth.cookie,
      },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    const dims = data.simulationResult.sectorImpacts.map((s) => s.dimension);
    const requiredDims = ["AGRICULTURE", "WATER", "ECOLOGY", "URBAN DEVELOPMENT", "INFRASTRUCTURE", "LAND GOVERNANCE"];
    const allPresent = requiredDims.every((d) => dims.includes(d));

    console.log(`Covered Dimensions (${dims.length}): ${dims.join(", ")}`);

    if (allPresent && dims.length === 6) {
      console.log("TEST 10 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 10 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 10 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 11: Trade-offs appear
  console.log("--- TEST 11: Trade-offs appear ---");
  try {
    const res = await fetch(`${BASE_URL}/api/policy/simulate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: policymakerAuth.cookie,
      },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    const tradeOffs = data.simulationResult.tradeOffs;

    console.log(`Trade-Offs Count: ${tradeOffs.length}`);
    tradeOffs.forEach((to) => {
      console.log(`  * ${to.primaryBenefit} <-> ${to.correspondingCost} (Severity: ${to.severity})`);
    });

    if (tradeOffs && tradeOffs.length >= 3) {
      console.log("TEST 11 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 11 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 11 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 12: Evidence can be attached
  console.log("--- TEST 12: Evidence can be attached ---");
  try {
    const res = await fetch(`${BASE_URL}/api/policy/simulate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: policymakerAuth.cookie,
      },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    const evidenceList = data.simulationResult.evidenceUsed;

    console.log(`Attached Evidence Count: ${evidenceList.length}`);
    if (evidenceList.length > 0) {
      console.log(`Attached Study: '${evidenceList[0].title}' (${evidenceList[0].authorOrOrg})`);
    }

    if (evidenceList.length > 0) {
      console.log("TEST 12 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 12 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 12 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 13: WHY / Evidence Trace opens
  console.log("--- TEST 13: WHY / Evidence Trace opens ---");
  try {
    const res = await fetch(`${BASE_URL}/api/policy/why?key=why-agriculture`, {
      headers: { Cookie: policymakerAuth.cookie },
    });
    const data = await res.json();

    console.log(`HTTP Status: ${res.status}`);
    console.log(`Question: ${data.trail.question}`);
    console.log(`Evidence Source: ${data.trail.evidenceSource.title}`);
    console.log(`Calculation: ${data.trail.calculationDetails}`);

    if (res.status === 200 && data.trail && data.trail.evidenceSource) {
      console.log("TEST 13 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 13 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 13 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 14: Alternative scenarios can be compared
  console.log("--- TEST 14: Alternative scenarios can be compared ---");
  try {
    const res = await fetch(`${BASE_URL}/app/policy-lab`, {
      headers: { Cookie: policymakerAuth.cookie },
    });
    const html = await res.text();
    const hasAlternativesTable = html.includes("Policy Alternatives Multi-Scenario Comparison") || html.includes("Scenario A (Controlled Expansion)");
    const hasBaseline = html.includes("Baseline (Unregulated)");
    const hasScenarioB = html.includes("Scenario B (Agro Protection)");

    console.log(`Table rendered: ${hasAlternativesTable}, Baseline: ${hasBaseline}, Scenario B: ${hasScenarioB}`);

    if (hasAlternativesTable && hasBaseline && hasScenarioB) {
      console.log("TEST 14 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 14 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 14 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 15: Stress test works
  console.log("--- TEST 15: Stress test works ---");
  try {
    const resNormal = await fetch(`${BASE_URL}/api/policy/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: policymakerAuth.cookie },
      body: JSON.stringify({ stressCondition: "Normal Conditions" }),
    });
    const dataNormal = await resNormal.json();

    const resClimate = await fetch(`${BASE_URL}/api/policy/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: policymakerAuth.cookie },
      body: JSON.stringify({ stressCondition: "Climate Stress" }),
    });
    const dataClimate = await resClimate.json();

    console.log(`Normal Stress Condition: ${dataNormal.simulationResult.stressCondition}`);
    console.log(`Climate Stress Condition: ${dataClimate.simulationResult.stressCondition}`);

    if (dataNormal.simulationResult.stressCondition === "Normal Conditions" && dataClimate.simulationResult.stressCondition === "Climate Stress") {
      console.log("TEST 15 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 15 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 15 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 16: Policy context can be passed to Reports
  console.log("--- TEST 16: Policy context can be passed to Reports ---");
  try {
    const res = await fetch(`${BASE_URL}/app/policy-lab`, {
      headers: { Cookie: policymakerAuth.cookie },
    });
    const html = await res.text();
    const hasReportButton = html.includes("Generate Policy Brief");

    console.log(`Generate Policy Brief action present: ${hasReportButton}`);

    if (hasReportButton) {
      console.log("TEST 16 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 16 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 16 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 17: Policy context can link back to Research
  console.log("--- TEST 17: Policy context can link back to Research ---");
  try {
    const res = await fetch(`${BASE_URL}/app/policy-lab`, {
      headers: { Cookie: policymakerAuth.cookie },
    });
    const html = await res.text();
    const hasResearchLink = html.includes("View Supporting Research");

    console.log(`View Supporting Research action present: ${hasResearchLink}`);

    if (hasResearchLink) {
      console.log("TEST 17 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 17 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 17 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 18: Private scenarios cannot be accessed by unauthorized users
  console.log("--- TEST 18: Private scenarios cannot be accessed by unauthorized users ---");
  try {
    const publicAuth = await login("public@landscope.demo");
    const res = await fetch(`${BASE_URL}/api/policy/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: publicAuth.cookie },
      body: JSON.stringify({}),
    });
    console.log(`Public user /api/policy/simulate status: ${res.status} (Expected: 403 Forbidden)`);

    if (res.status === 403) {
      console.log("TEST 18 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 18 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 18 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 19: Unauthenticated users cannot access Policy Lab
  console.log("--- TEST 19: Unauthenticated users cannot access Policy Lab ---");
  try {
    const pageRes = await fetch(`${BASE_URL}/app/policy-lab`, { redirect: "manual" });
    console.log(`Unauthenticated /app/policy-lab status: ${pageRes.status} (Expected: 307 or 302 to /login)`);

    const apiRes = await fetch(`${BASE_URL}/api/policy/scenarios`);
    console.log(`Unauthenticated /api/policy/scenarios status: ${apiRes.status} (Expected: 401 Unauthorized)`);

    if ((pageRes.status === 307 || pageRes.status === 302) && apiRes.status === 401) {
      console.log("TEST 19 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 19 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 19 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 20: No synthetic result is presented as an official government forecast
  console.log("--- TEST 20: No synthetic result is presented as an official government forecast ---");
  try {
    const res = await fetch(`${BASE_URL}/api/policy/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: policymakerAuth.cookie },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    const result = data.simulationResult;

    const hasIllustrativeStatus = result.status === "Illustrative Model Output";
    const hasLimitations = result.limitations && result.limitations.length > 0;
    const explicitlyWarns = result.limitations.some((l) => l.includes("prototype") || l.includes("do not constitute statutory"));

    console.log(`Output Status: '${result.status}' (Required: 'Illustrative Model Output')`);
    console.log(`Explicit Limitations Excluded: ${explicitlyWarns}`);

    if (hasIllustrativeStatus && explicitlyWarns) {
      console.log("TEST 20 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 20 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 20 ERROR: ${e.message}`);
    allPassed = false;
  }

  console.log("==================================================");
  if (allPassed) {
    console.log("FINAL VERDICT: ALL 20 POLICY DIGITAL TWIN TESTS PASSED! ✅");
  } else {
    console.error("FINAL VERDICT: SOME TESTS FAILED ❌");
  }
  console.log("==================================================");
}

runPolicyTwinSuite();
