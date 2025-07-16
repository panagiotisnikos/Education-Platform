import React, { useState } from "react";

const AddSection = ({ trainingPlanId, onSectionAdded }) => {
    const [sectionTitle, setSectionTitle] = useState("");
    const [sectionContent, setSectionContent] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!sectionTitle.trim()) {
            alert("Section title cannot be empty.");
            return;
        }

        const formData = new FormData();
        formData.append("training_plan_id", trainingPlanId);
        formData.append("title", sectionTitle);
        formData.append("content", sectionContent);

        try {
            const response = await fetch("http://localhost/eduplatform/api/addSection.php", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                alert("Section added successfully!");
                setSectionTitle("");
                setSectionContent("");
                onSectionAdded();
            } else {
                alert("Error adding section: " + data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to add section.");
        }
    };

    return (
        <div style={{ marginTop: "10px", padding: "10px", border: "1px solid #ccc" }}>
            <h4>Add New Section</h4>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Section Title"
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    required
                    style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
                />
                <textarea
                    placeholder="Section Content (Optional)"
                    value={sectionContent}
                    onChange={(e) => setSectionContent(e.target.value)}
                    style={{ width: "100%", height: "80px", marginBottom: "10px", padding: "5px" }}
                />
                <button type="submit">Add Section</button>
            </form>
        </div>
    );
};

export default AddSection;

