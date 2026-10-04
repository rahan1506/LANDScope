/**
 * Automated RBAC Verification Suite for LANDScope SIH26019
 * Tests all 7 Acceptance Tests against the active server.
 */

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("==================================================");
  console.log("LANDScope RBAC ACCEPTANCE TEST SUITE (SIH26019)");
  console.log("==================================================\n");

  let allPassed = true;

  // Helper to extract session cookie
  function getCookie(response) {
    const raw = response.headers.get("set-cookie");
    if (!raw) return null;
    return raw.split(";")[0];
  }

  // ---------------------------------------------------------------
  // TEST 1: Login as Researcher -> Only Researcher workspace appears
  // ---------------------------------------------------------------
  console.log("--- TEST 1: Login as Researcher ---");
  const loginRes1 = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "researcher@landscope.demo" }),
  });
  const loginData1 = await loginRes1.json();
  const researcherCookie = getCookie(loginRes1);

  const meRes1 = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: researcherCookie },
  });
  const meData1 = await meRes1.json();

  const researcherPageRes = await fetch(`${BASE_URL}/app/researcher`, {
    headers: { Cookie: researcherCookie },
  });
  const researcherPageText = await researcherPageRes.text();

  const test1Passed =
    meData1.user.roleCode === "RESEARCHER" &&
    researcherPageRes.status === 200 &&
    researcherPageText.includes("Research Intelligence Workspace") &&
    !researcherPageText.includes("Restricted Workspace");

  console.log(`Role: ${meData1.user.roleCode}`);
  console.log(`Workspace Page Status: ${researcherPageRes.status}`);
  console.log(`Authorized Modules count: ${meData1.role.allowedModules.length}`);
  console.log(`TEST 1 RESULT: ${test1Passed ? "PASSED ✅" : "FAILED ❌"}\n`);
  if (!test1Passed) allPassed = false;

  // ---------------------------------------------------------------
  // TEST 2: As Researcher manually navigate to /app/policymaker -> Access Denied
  // ---------------------------------------------------------------
  console.log("--- TEST 2: Researcher Navigating to /app/policymaker ---");
  const forbiddenPageRes = await fetch(`${BASE_URL}/app/policymaker`, {
    headers: { Cookie: researcherCookie },
  });
  const forbiddenPageText = await forbiddenPageRes.text();

  const test2Passed =
    forbiddenPageText.includes("Restricted Workspace") &&
    forbiddenPageText.includes("403 Forbidden") &&
    forbiddenPageText.includes("Your Authenticated Role:") &&
    forbiddenPageText.includes("Researcher");

  console.log(`Access Denied Rendered: ${forbiddenPageText.includes("Restricted Workspace")}`);
  console.log(`TEST 2 RESULT: ${test2Passed ? "PASSED ✅" : "FAILED ❌"}\n`);
  if (!test2Passed) allPassed = false;

  // ---------------------------------------------------------------
  // TEST 3: As Researcher call policymaker API (/api/policy/scenarios) -> 403 Forbidden
  // ---------------------------------------------------------------
  console.log("--- TEST 3: Researcher calling /api/policy/scenarios ---");
  const policyApiRes = await fetch(`${BASE_URL}/api/policy/scenarios`, {
    headers: { Cookie: researcherCookie },
  });
  const policyApiData = await policyApiRes.json();

  const test3Passed =
    policyApiRes.status === 403 &&
    policyApiData.error === "FORBIDDEN" &&
    policyApiData.requiredPermission === "policy:read";

  console.log(`HTTP Status: ${policyApiRes.status} (Expected: 403)`);
  console.log(`Error message: ${policyApiData.message}`);
  console.log(`TEST 3 RESULT: ${test3Passed ? "PASSED ✅" : "FAILED ❌"}\n`);
  if (!test3Passed) allPassed = false;

  // ---------------------------------------------------------------
  // TEST 4: Login as Policymaker -> Policy Lab is visible & authorized
  // ---------------------------------------------------------------
  console.log("--- TEST 4: Login as Policymaker ---");
  const loginRes4 = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "policymaker@landscope.demo" }),
  });
  const policymakerCookie = getCookie(loginRes4);

  const policyApiAuthRes = await fetch(`${BASE_URL}/api/policy/scenarios`, {
    headers: { Cookie: policymakerCookie },
  });
  const policyApiAuthData = await policyApiAuthRes.json();

  const policymakerPageRes = await fetch(`${BASE_URL}/app/policymaker`, {
    headers: { Cookie: policymakerCookie },
  });
  const policymakerPageText = await policymakerPageRes.text();

  const test4Passed =
    policyApiAuthRes.status === 200 &&
    policyApiAuthData.authorized === true &&
    policymakerPageText.includes("Policy Decision Workspace") &&
    policymakerPageText.includes("Create Policy Scenario");

  console.log(`Policy API HTTP Status: ${policyApiAuthRes.status} (Expected: 200)`);
  console.log(`Scenarios retrieved: ${policyApiAuthData.scenarios?.length}`);
  console.log(`Policy Decision Workspace visible: ${policymakerPageText.includes("Policy Decision Workspace")}`);
  console.log(`TEST 4 RESULT: ${test4Passed ? "PASSED ✅" : "FAILED ❌"}\n`);
  if (!test4Passed) allPassed = false;

  // ---------------------------------------------------------------
  // TEST 5: Login as Public -> No Policy Lab, no admin, no collaboration
  // ---------------------------------------------------------------
  console.log("--- TEST 5: Login as Public User ---");
  const loginRes5 = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "public@landscope.demo" }),
  });
  const publicCookie = getCookie(loginRes5);

  const meRes5 = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: publicCookie },
  });
  const meData5 = await meRes5.json();

  const publicPolicyApiRes = await fetch(`${BASE_URL}/api/policy/scenarios`, {
    headers: { Cookie: publicCookie },
  });

  const publicAdminApiRes = await fetch(`${BASE_URL}/api/admin/users`, {
    headers: { Cookie: publicCookie },
  });

  const hasNoRestrictedTools =
    !meData5.role.allowedModules.includes("policy-lab") &&
    !meData5.role.allowedModules.includes("collaboration") &&
    !meData5.role.allowedModules.includes("user-management") &&
    publicPolicyApiRes.status === 403 &&
    publicAdminApiRes.status === 403;

  const test5Passed = meData5.user.roleCode === "PUBLIC" && hasNoRestrictedTools;

  console.log(`Role: ${meData5.user.roleCode}`);
  console.log(`Allowed modules: ${meData5.role.allowedModules.join(", ")}`);
  console.log(`Policy API status for Public: ${publicPolicyApiRes.status} (Expected: 403)`);
  console.log(`Admin API status for Public: ${publicAdminApiRes.status} (Expected: 403)`);
  console.log(`TEST 5 RESULT: ${test5Passed ? "PASSED ✅" : "FAILED ❌"}\n`);
  if (!test5Passed) allPassed = false;

  // ---------------------------------------------------------------
  // TEST 6: Logout -> All protected routes require authentication
  // ---------------------------------------------------------------
  console.log("--- TEST 6: Logout and Route Protection ---");
  const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: { Cookie: policymakerCookie },
  });

  const unauthApiRes = await fetch(`${BASE_URL}/api/auth/me`);
  const unauthApiResponse = await unauthApiRes.json();

  const unauthPolicyRes = await fetch(`${BASE_URL}/api/policy/scenarios`);

  // Unauthenticated request to /app/policymaker without cookie
  const unauthPageRes = await fetch(`${BASE_URL}/app/policymaker`, {
    redirect: "manual",
  });

  const test6Passed =
    unauthApiRes.status === 401 &&
    unauthPolicyRes.status === 401 &&
    (unauthPageRes.status === 307 || unauthPageRes.status === 302 || unauthPageRes.status === 308);

  console.log(`Unauthenticated /api/auth/me status: ${unauthApiRes.status} (Expected: 401)`);
  console.log(`Unauthenticated /api/policy/scenarios status: ${unauthPolicyRes.status} (Expected: 401)`);
  console.log(`Unauthenticated /app/policymaker redirect status: ${unauthPageRes.status} (Expected: 307/302)`);
  console.log(`TEST 6 RESULT: ${test6Passed ? "PASSED ✅" : "FAILED ❌"}\n`);
  if (!test6Passed) allPassed = false;

  // ---------------------------------------------------------------
  // TEST 7: Attempt to manipulate role in browser cookie
  // ---------------------------------------------------------------
  console.log("--- TEST 7: Attempting Cookie Role Manipulation Attack ---");
  // Forged payload with roleCode: ADMIN but invalid signature
  const forgedPayload = Buffer.from(
    JSON.stringify({
      userId: "usr_researcher_01",
      email: "researcher@landscope.demo",
      roleCode: "ADMIN",
      createdAt: Date.now(),
    })
  ).toString("base64url");
  const fakeToken = `${forgedPayload}.fake_unauthorized_hmac_signature`;

  const forgedApiRes = await fetch(`${BASE_URL}/api/policy/scenarios`, {
    headers: { Cookie: `landscope_session_token=${fakeToken}` },
  });

  const test7Passed = forgedApiRes.status === 401;

  console.log(`Forged Token /api/policy/scenarios status: ${forgedApiRes.status} (Expected: 401)`);
  console.log(`TEST 7 RESULT: ${test7Passed ? "PASSED ✅" : "FAILED ❌"}\n`);
  if (!test7Passed) allPassed = false;

  // ---------------------------------------------------------------
  // FINAL VERDICT
  // ---------------------------------------------------------------
  console.log("==================================================");
  if (allPassed) {
    console.log("FINAL VERDICT: ALL 7 RBAC ACCEPTANCE TESTS PASSED! ✅");
  } else {
    console.log("FINAL VERDICT: SOME TESTS FAILED. CHECK OUTPUT ❌");
  }
  console.log("==================================================");
}

runTests().catch(console.error);
