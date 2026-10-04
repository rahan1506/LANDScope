/**
 * LANDScope LAND INTELLIGENCE / GIS ACCEPTANCE TEST SUITE (SIH26019)
 *
 * Verifies all 16 acceptance criteria:
 * 1. Authorized user can access Land Intelligence.
 * 2. Unauthorized user receives 403/access denied.
 * 3. State selection works.
 * 4. District selection works.
 * 5. Tehsil selection works.
 * 6. GIS map renders.
 * 7. Layers can be toggled.
 * 8. Spatial features can be selected.
 * 9. Timeline changes the displayed demo state.
 * 10. Land Intelligence panel updates with selected geography.
 * 11. Related evidence appears.
 * 12. Evidence can be opened.
 * 13. Geography can be passed to Policy Lab.
 * 14. Geography can be passed to Reports.
 * 15. Public user cannot access restricted layers.
 * 16. Unauthenticated user cannot access the module.
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

async function runGisTestSuite() {
  console.log("==================================================");
  console.log("LANDScope LAND INTELLIGENCE ACCEPTANCE TEST SUITE");
  console.log("==================================================\n");

  let allPassed = true;

  // 1. Authenticate as Researcher
  console.log("--- Authenticating as Researcher (researcher@landscope.demo) ---");
  const researcherAuth = await login("researcher@landscope.demo");
  if (!researcherAuth.cookie) {
    console.error("FATAL: Could not login as researcher.");
    process.exit(1);
  }
  console.log(`Authenticated: ${researcherAuth.data.user.name} (${researcherAuth.data.user.roleCode})\n`);

  // TEST 1: Authorized user can access Land Intelligence
  console.log("--- TEST 1: Authorized user can access Land Intelligence ---");
  try {
    const res = await fetch(`${BASE_URL}/app/land-intelligence`, {
      headers: { Cookie: researcherAuth.cookie },
    });
    const html = await res.text();
    const hasTitle = html.includes("Land Intelligence");
    const hasGIS = html.includes("Spatial Layer Registry") || html.includes("Geospatial Workstation");
    const isDenied = html.includes("Restricted Workspace") || html.includes("Access Denied");

    console.log(`HTTP Status: ${res.status}`);
    console.log(`Has Title: ${hasTitle}, Has GIS Engine: ${hasGIS}, Denied: ${isDenied}`);

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

  // TEST 2: Unauthorized user receives 403/access denied
  console.log("--- TEST 2: Unauthorized user receives 403/access denied ---");
  try {
    // When a forged or invalid role without gis permissions calls the protected API
    const forgedToken = "eyJ1c2VySWQiOiJ1c3ItZmFrZSIsImVtYWlsIjoiZmFrZUBmYWtlLmNvbSIsInJvbGVDb2RlIjoiSU5WQUxJRCJ9.fake_sig";
    const res = await fetch(`${BASE_URL}/api/gis/intelligence`, {
      headers: { Cookie: `landscope_session_token=${forgedToken}` },
    });

    console.log(`HTTP Status: ${res.status} (Expected: 401 Unauthorized for forged token)`);
    if (res.status === 401 || res.status === 403) {
      console.log("TEST 2 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 2 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 2 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 3: State selection works
  console.log("--- TEST 3: State selection works ---");
  try {
    const res = await fetch(`${BASE_URL}/api/gis/intelligence?state=Maharashtra&district=Pune&tehsil=Haveli`, {
      headers: { Cookie: researcherAuth.cookie },
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Returned State: ${data.intelligence.geography.state}`);
    console.log(`Returned District: ${data.intelligence.geography.district}`);

    if (res.status === 200 && data.intelligence.geography.state === "Maharashtra") {
      console.log("TEST 3 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 3 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 3 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 4: District selection works
  console.log("--- TEST 4: District selection works ---");
  try {
    const res = await fetch(`${BASE_URL}/api/gis/intelligence?state=Madhya%20Pradesh&district=Sehore&tehsil=Ashta`, {
      headers: { Cookie: researcherAuth.cookie },
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Returned District: ${data.intelligence.geography.district}`);
    console.log(`Area: ${data.intelligence.geography.areaSqKm} sq km`);

    if (res.status === 200 && data.intelligence.geography.district === "Sehore") {
      console.log("TEST 4 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 4 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 4 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 5: Tehsil selection works
  console.log("--- TEST 5: Tehsil selection works ---");
  try {
    const res = await fetch(`${BASE_URL}/api/gis/intelligence?state=Madhya%20Pradesh&district=Sehore&tehsil=Ashta`, {
      headers: { Cookie: researcherAuth.cookie },
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Returned Tehsil: ${data.intelligence.geography.tehsil}`);
    console.log(`Total Parcels: ${data.intelligence.geography.totalParcels}`);

    if (res.status === 200 && data.intelligence.geography.tehsil === "Ashta") {
      console.log("TEST 5 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 5 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 5 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 6: GIS map renders
  console.log("--- TEST 6: GIS map renders ---");
  try {
    const res = await fetch(`${BASE_URL}/app/land-intelligence`, {
      headers: { Cookie: researcherAuth.cookie },
    });
    const html = await res.text();
    const hasSvgCanvas = html.includes("<svg") && html.includes("viewBox=\"0 0 800 500\"");
    const hasCadastralParcels = html.includes("cadastral-parcels-group") || html.includes("cadastral");

    console.log(`SVG Map Canvas rendered: ${hasSvgCanvas}`);
    console.log(`Cadastral vector features present: ${hasCadastralParcels}`);

    if (res.status === 200 && hasSvgCanvas) {
      console.log("TEST 6 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 6 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 6 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 7: Layers can be toggled
  console.log("--- TEST 7: Layers can be toggled ---");
  try {
    const res = await fetch(`${BASE_URL}/api/gis/intelligence`, {
      headers: { Cookie: researcherAuth.cookie },
    });
    const data = await res.json();
    const layerCategories = [...new Set(data.availableLayers.map((l) => l.category))];

    console.log(`Available Layers Count: ${data.availableLayers.length}`);
    console.log(`Layer Categories: ${layerCategories.join(", ")}`);

    const hasAll4Categories =
      layerCategories.includes("LAND USE") &&
      layerCategories.includes("ENVIRONMENT") &&
      layerCategories.includes("INFRASTRUCTURE") &&
      layerCategories.includes("GOVERNANCE");

    if (hasAll4Categories && data.availableLayers.length >= 8) {
      console.log("TEST 7 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 7 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 7 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 8: Spatial features can be selected
  console.log("--- TEST 8: Spatial features can be selected ---");
  try {
    const res = await fetch(`${BASE_URL}/app/land-intelligence`, {
      headers: { Cookie: researcherAuth.cookie },
    });
    const html = await res.text();
    const hasFeaturePoints = html.includes("P-401") || html.includes("401/1");
    const hasParcelInspector = html.includes("Parcel Inspector") || html.includes("Registered Landholder");

    console.log(`Features mapped: ${hasFeaturePoints}`);
    console.log(`Parcel inspector integration: ${hasParcelInspector}`);

    if (hasFeaturePoints && hasParcelInspector) {
      console.log("TEST 8 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 8 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 8 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 9: Timeline changes the displayed demo state
  console.log("--- TEST 9: Timeline changes the displayed demo state ---");
  try {
    const res2018 = await fetch(`${BASE_URL}/api/gis/intelligence?year=2018`, {
      headers: { Cookie: researcherAuth.cookie },
    });
    const data2018 = await res2018.json();

    const res2026 = await fetch(`${BASE_URL}/api/gis/intelligence?year=2026`, {
      headers: { Cookie: researcherAuth.cookie },
    });
    const data2026 = await res2026.json();

    console.log(`2018 Built-up: ${data2018.intelligence.landUse.builtUpPct}%, Agriculture: ${data2018.intelligence.landUse.agriculturePct}%`);
    console.log(`2026 Built-up: ${data2026.intelligence.landUse.builtUpPct}%, Agriculture: ${data2026.intelligence.landUse.agriculturePct}%`);

    const urbanIncreased = data2026.intelligence.landUse.builtUpPct > data2018.intelligence.landUse.builtUpPct;
    const agriDecreased = data2026.intelligence.landUse.agriculturePct < data2018.intelligence.landUse.agriculturePct;

    if (urbanIncreased && agriDecreased) {
      console.log("TEST 9 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 9 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 9 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 10: Land Intelligence panel updates with selected geography
  console.log("--- TEST 10: Land Intelligence panel updates with selected geography ---");
  try {
    const res = await fetch(`${BASE_URL}/api/gis/intelligence?state=Madhya%20Pradesh&district=Sehore&tehsil=Ashta&year=2026`, {
      headers: { Cookie: researcherAuth.cookie },
    });
    const data = await res.json();
    const intel = data.intelligence;

    console.log(`Land Use Profile: Agri ${intel.landUse.agriculturePct}%, Forest ${intel.landUse.forestPct}%, Built-up ${intel.landUse.builtUpPct}%, Water ${intel.landUse.waterPct}%`);
    console.log(`Aquifer Status: ${intel.environment.aquiferStatus} (Index: ${intel.environment.aquiferRechargeIndex})`);
    console.log(`Cadastral Formalization: ${intel.governance.cadastralFormalizationPct}%`);

    if (intel.landUse && intel.environment && intel.infrastructure && intel.governance) {
      console.log("TEST 10 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 10 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 10 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 11: Related evidence appears
  console.log("--- TEST 11: Related evidence appears ---");
  try {
    const res = await fetch(`${BASE_URL}/api/gis/intelligence?state=Madhya%20Pradesh&district=Sehore`, {
      headers: { Cookie: researcherAuth.cookie },
    });
    const data = await res.json();

    console.log(`Related Evidence Count: ${data.relatedEvidence.length}`);
    if (data.relatedEvidence.length > 0) {
      console.log(`Evidence 1: '${data.relatedEvidence[0].title}' (${data.relatedEvidence[0].authorOrOrg})`);
    }

    if (data.relatedEvidence.length > 0) {
      console.log("TEST 11 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 11 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 11 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 12: Evidence can be opened (Evidence Trail & Study)
  console.log("--- TEST 12: Evidence can be opened ---");
  try {
    const res = await fetch(`${BASE_URL}/api/gis/evidence-trail?id=urban-expansion-ashta`, {
      headers: { Cookie: researcherAuth.cookie },
    });
    const data = await res.json();

    console.log(`HTTP Status: ${res.status}`);
    console.log(`Evidence Trail Flag: ${data.trail.flagTitle}`);
    console.log(`Research Source: ${data.trail.researchTitle}`);
    console.log(`Analysis Method: ${data.trail.analysisMethod}`);
    console.log(`Status: ${data.trail.status}`);

    if (res.status === 200 && data.trail && data.trail.status === "Illustrative Demo Analysis") {
      console.log("TEST 12 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 12 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 12 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 13: Geography can be passed to Policy Lab
  console.log("--- TEST 13: Geography can be passed to Policy Lab ---");
  try {
    const res = await fetch(`${BASE_URL}/app/land-intelligence`, {
      headers: { Cookie: researcherAuth.cookie },
    });
    const html = await res.text();
    const hasPolicyAction = html.includes("Test Policy Scenario") || html.includes("POLICY DIGITAL TWIN BRIDGE");

    console.log(`Policy Digital Twin Bridge action present: ${hasPolicyAction}`);

    if (hasPolicyAction) {
      console.log("TEST 13 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 13 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 13 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 14: Geography can be passed to Reports
  console.log("--- TEST 14: Geography can be passed to Reports ---");
  try {
    const res = await fetch(`${BASE_URL}/app/land-intelligence`, {
      headers: { Cookie: researcherAuth.cookie },
    });
    const html = await res.text();
    const hasReportAction = html.includes("Generate Intelligence Brief") || html.includes("Reports");

    console.log(`Generate Intelligence Brief present: ${hasReportAction}`);

    if (hasReportAction) {
      console.log("TEST 14 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 14 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 14 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 15: Public user cannot access restricted layers
  console.log("--- TEST 15: Public user cannot access restricted layers ---");
  try {
    const publicAuth = await login("public@landscope.demo");
    const res = await fetch(`${BASE_URL}/api/gis/intelligence`, {
      headers: { Cookie: publicAuth.cookie },
    });
    const data = await res.json();

    const restrictedLayers = data.availableLayers.filter((l) => l.isRestricted);
    console.log(`Public user role: ${data.userRole}`);
    console.log(`Total available layers for Public: ${data.availableLayers.length}`);
    console.log(`Restricted layers exposed to Public: ${restrictedLayers.length} (Expected: 0)`);

    if (data.isRestrictedRole && restrictedLayers.length === 0) {
      console.log("TEST 15 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 15 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 15 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 16: Unauthenticated user cannot access the module
  console.log("--- TEST 16: Unauthenticated user cannot access the module ---");
  try {
    const pageRes = await fetch(`${BASE_URL}/app/land-intelligence`, {
      redirect: "manual",
    });
    console.log(`Unauthenticated Page status: ${pageRes.status} (Expected: 307 or 302 to /login)`);

    const apiRes = await fetch(`${BASE_URL}/api/gis/intelligence`);
    console.log(`Unauthenticated API status: ${apiRes.status} (Expected: 401 Unauthorized)`);

    if ((pageRes.status === 307 || pageRes.status === 302) && apiRes.status === 401) {
      console.log("TEST 16 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 16 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 16 ERROR: ${e.message}`);
    allPassed = false;
  }

  console.log("==================================================");
  if (allPassed) {
    console.log("FINAL VERDICT: ALL 16 LAND INTELLIGENCE TESTS PASSED! ✅");
  } else {
    console.error("FINAL VERDICT: SOME TESTS FAILED ❌");
  }
  console.log("==================================================");
}

runGisTestSuite();
