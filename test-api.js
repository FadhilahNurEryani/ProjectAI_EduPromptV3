// Simple test script to debug API
async function testGenerateTemplate() {
  const description = "Saya ingin membuat prompt untuk guru menganalisis kemampuan berpikir kritis siswa dengan memberikan pertanyaan Socratic method";
  
  try {
    console.log("Testing API /api/templates/generate...");
    const response = await fetch("/api/templates/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: description.trim(),
        subjectArea: "Matematika",
        gradeLevel: "SD",
      }),
    });

    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", data);

    if (!response.ok) {
      console.error("API Error:", data);
    } else {
      console.log("Success:", data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testGenerateTemplate();
