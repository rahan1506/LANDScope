/**
 * LANDScope Researcher Workspace Acceptance Test Suite (SIH26019)
 *
 * Verifies all 10 acceptance criteria:
 * 1. Researcher can access /app/researcher.
 * 2. Researcher can create a research project.
 * 3. Researcher can add evidence to a project.
 * 4. Researcher can open evidence details.
 * 5. Researcher can use AI Research Copilot.
 * 6. Researcher can navigate from evidence to GIS.
 * 7. Researcher can save evidence for future policy scenarios.
 * 8. Policymaker cannot access researcher-private project data.
 * 9. Public cannot access researcher workspace.
 * 10. Unauthenticated users cannot access researcher workspace.
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

async function runTestSuite() {
  console.log("==================================================");
  console.log("LANDScope RESEARCHER WORKSPACE ACCEPTANCE TEST SUITE");
  console.log("==================================================\n");

  let allPassed = true;

  // Login as Researcher
  console.log("--- Authenticating as Researcher (researcher@landscope.demo) ---");
  const researcherAuth = await login("researcher@landscope.demo");
  if (!researcherAuth.cookie) {
    console.error("FATAL: Could not login as researcher.");
    process.exit(1);
  }
  console.log(`Authenticated: ${researcherAuth.data.user.name} (${researcherAuth.data.user.roleCode})\n`);

  // TEST 1: Researcher can access /app/researcher
  console.log("--- TEST 1: Researcher can access /app/researcher ---");
  try {
    const res = await fetch(`${BASE_URL}/app/researcher`, {
      headers: { Cookie: researcherAuth.cookie },
    });
    const html = await res.text();
    const hasWorkspaceTitle = html.includes("Research Intelligence Workspace");
    const isAccessDenied = html.includes("Restricted Workspace") || html.includes("Access Denied");

    console.log(`HTTP Status: ${res.status}`);
    console.log(`Has Workspace Title: ${hasWorkspaceTitle}`);
    console.log(`Access Denied shown: ${isAccessDenied}`);

    if (res.status === 200 && hasWorkspaceTitle && !isAccessDenied) {
      console.log("TEST 1 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 1 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 1 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 2: Researcher can create a research project
  console.log("--- TEST 2: Researcher can create a research project ---");
  let createdProjectId = "";
  try {
    const res = await fetch(`${BASE_URL}/api/research/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: researcherAuth.cookie,
      },
      body: JSON.stringify({
        title: "Evaluation of Peri-Urban Cadastre & Land Use Diversions (Test Project)",
        subtitle: "Spatial econometrics audit of agricultural buffer conversions",
        description: "Assessing correlation between revenue mutation backlog and unauthorized land conversion.",
        researchQuestions: [
          {
            question: "How does mutation processing delay impact unauthorized boundary alteration?",
            hypothesis: "Delays over 60 days increase informal subdivision risk by 40%.",
          },
        ],
      }),
    });

    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Success: ${data.success}`);
    if (data.project) {
      createdProjectId = data.project.id;
      console.log(`Created Project ID: ${createdProjectId}`);
      console.log(`Project Title: ${data.project.title}`);
    }

    if (res.status === 201 && data.success && createdProjectId) {
      console.log("TEST 2 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 2 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 2 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 3: Researcher can add evidence to a project
  console.log("--- TEST 3: Researcher can add evidence to a project ---");
  try {
    const targetProjId = createdProjectId || "proj-urban-agri-01";
    const res = await fetch(`${BASE_URL}/api/research/projects/${targetProjId}/evidence`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: researcherAuth.cookie,
      },
      body: JSON.stringify({
        evidenceId: "ev-103", // Spatial Quantification of Eco-Sensitive Buffer Zone Encroachments
      }),
    });

    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Success: ${data.success}`);
    console.log(`Message: ${data.message}`);
    if (data.project) {
      console.log(`Updated Project Evidence Count: ${data.project.evidenceCount}`);
    }

    if (res.status === 200 && data.success) {
      console.log("TEST 3 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 3 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 3 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 4: Researcher can open evidence details
  console.log("--- TEST 4: Researcher can open evidence details ---");
  try {
    const res = await fetch(`${BASE_URL}/api/research/evidence?query=Ground%20Water`, {
      headers: { Cookie: researcherAuth.cookie },
    });

    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Total Evidence Matching: ${data.totalCount}`);
    if (data.evidence && data.evidence.length > 0) {
      const ev = data.evidence[0];
      console.log(`Retrieved Evidence: '${ev.title}'`);
      console.log(`Author/Agency: ${ev.authorOrOrg} (${ev.year})`);
      console.log(`Confidence Score: ${ev.confidenceScore}%`);
      console.log(`Demo Status: ${ev.isDemoRecord ? "Illustrative Demo Record" : "Official Public"}`);
    }

    if (res.status === 200 && data.totalCount > 0) {
      console.log("TEST 4 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 4 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 4 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 5: Researcher can use AI Research Copilot
  console.log("--- TEST 5: Researcher can use AI Research Copilot ---");
  try {
    const res = await fetch(`${BASE_URL}/api/research/copilot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: researcherAuth.cookie,
      },
      body: JSON.stringify({
        query: "What research exists on agricultural-to-urban land conversion?",
      }),
    });

    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Success: ${data.success}`);
    if (data.result) {
      console.log(`Answer snippet: ${data.result.answer.slice(0, 140)}...`);
      console.log(`Supporting Sources Count: ${data.result.supportingSources.length}`);
      if (data.result.supportingSources.length > 0) {
        console.log(`Cited Source 1: [${data.result.supportingSources[0].type}] ${data.result.supportingSources[0].title}`);
      }
    }

    if (res.status === 200 && data.success && data.result.supportingSources.length > 0) {
      console.log("TEST 5 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 5 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 5 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 6: Researcher can navigate from evidence to GIS
  console.log("--- TEST 6: Researcher can navigate from evidence to GIS ---");
  try {
    // Verify that evidence items contain spatialContext linking directly to GIS
    const res = await fetch(`${BASE_URL}/api/research/evidence`, {
      headers: { Cookie: researcherAuth.cookie },
    });
    const data = await res.json();
    const spatialEv = data.evidence.find((e) => e.spatialContext && e.spatialContext.state);

    console.log(`Found evidence with Spatial Context: ${spatialEv ? spatialEv.title : "None"}`);
    if (spatialEv && spatialEv.spatialContext) {
      console.log(`Spatial Target: ${spatialEv.spatialContext.state} / ${spatialEv.spatialContext.district || ""} (${spatialEv.spatialContext.defaultLayer || "cadastral"})`);
    }

    if (res.status === 200 && spatialEv && spatialEv.spatialContext) {
      console.log("TEST 6 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 6 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 6 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 7: Researcher can save evidence for future policy scenarios
  console.log("--- TEST 7: Researcher can save evidence for future policy scenarios ---");
  try {
    const res = await fetch(`${BASE_URL}/api/research/evidence/link-policy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: researcherAuth.cookie,
      },
      body: JSON.stringify({
        evidenceId: "ev-101",
        scenarioTitle: "Peri-Urban Master Plan 2031 Aquifer Protection Zoning",
        rationale: "Empirical input parameters for groundwater recharge simulation in Policy Twin.",
      }),
    });

    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Success: ${data.success}`);
    if (data.policyLink) {
      console.log(`Linked Policy Scenario: '${data.policyLink.title}' (ID: ${data.policyLink.id})`);
    }

    if (res.status === 200 && data.success && data.policyLink) {
      console.log("TEST 7 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 7 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 7 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 8: Policymaker cannot access researcher-private project data
  console.log("--- TEST 8: Policymaker cannot access researcher-private project data ---");
  try {
    const policymakerAuth = await login("policymaker@landscope.demo");
    const targetProjId = createdProjectId || "proj-urban-agri-01";

    const res = await fetch(`${BASE_URL}/api/research/projects/${targetProjId}`, {
      headers: { Cookie: policymakerAuth.cookie },
    });

    const data = await res.json();
    console.log(`HTTP Status: ${res.status} (Expected: 403 Forbidden)`);
    console.log(`Error Response: ${data.message || data.error}`);

    // Also check page route: /app/researcher/projects/[projectId]
    const pageRes = await fetch(`${BASE_URL}/app/researcher/projects/${targetProjId}`, {
      headers: { Cookie: policymakerAuth.cookie },
    });
    const pageHtml = await pageRes.text();
    const hasAccessDenied = pageHtml.includes("Restricted Workspace") || pageHtml.includes("Access Denied");
    console.log(`Page Route Status: ${pageRes.status}, Access Denied Rendered: ${hasAccessDenied}`);

    if (res.status === 403 && hasAccessDenied) {
      console.log("TEST 8 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 8 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 8 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 9: Public cannot access researcher workspace
  console.log("--- TEST 9: Public cannot access researcher workspace ---");
  try {
    const publicAuth = await login("public@landscope.demo");
    const res = await fetch(`${BASE_URL}/app/researcher`, {
      headers: { Cookie: publicAuth.cookie },
    });
    const html = await res.text();
    const hasAccessDenied = html.includes("Restricted Workspace") || html.includes("Access Denied");

    console.log(`HTTP Status: ${res.status}`);
    console.log(`Access Denied Rendered: ${hasAccessDenied}`);

    const apiRes = await fetch(`${BASE_URL}/api/research/projects`, {
      headers: { Cookie: publicAuth.cookie },
    });
    console.log(`API Status for Public: ${apiRes.status} (Expected: 403)`);

    if (hasAccessDenied && apiRes.status === 403) {
      console.log("TEST 9 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 9 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 9 ERROR: ${e.message}`);
    allPassed = false;
  }

  // TEST 10: Unauthenticated users cannot access researcher workspace
  console.log("--- TEST 10: Unauthenticated users cannot access researcher workspace ---");
  try {
    const res = await fetch(`${BASE_URL}/app/researcher`, {
      redirect: "manual",
    });
    console.log(`Page Redirect Status: ${res.status} (Expected: 307 or 302 to /login)`);

    const apiRes = await fetch(`${BASE_URL}/api/research/projects`);
    console.log(`API Status without auth: ${apiRes.status} (Expected: 401 Unauthorized)`);

    if ((res.status === 307 || res.status === 302) && apiRes.status === 401) {
      console.log("TEST 10 RESULT: PASSED ✅\n");
    } else {
      console.error("TEST 10 RESULT: FAILED ❌\n");
      allPassed = false;
    }
  } catch (e) {
    console.error(`TEST 10 ERROR: ${e.message}`);
    allPassed = false;
  }

  console.log("==================================================");
  if (allPassed) {
    console.log("FINAL VERDICT: ALL 10 RESEARCHER ACCEPTANCE TESTS PASSED! ✅");
  } else {
    console.error("FINAL VERDICT: SOME TESTS FAILED ❌");
  }
  console.log("==================================================");
}

runTestSuite();
