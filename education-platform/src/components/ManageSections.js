import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageSections = ({ trainingPlanId }) => {
  const [sections, setSections] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingSection, setEditingSection] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSections();
  }, [trainingPlanId]);

  const fetchSections = async () => {
    try {
      const response = await axios.get(
        `http://localhost/eduplatform/api/sections.php?training_plan_id=${trainingPlanId}`
      );
      if (response.data.success) {
        setSections(response.data.sections);
      } else {
        setSections([]);
      }
    } catch (error) {
      console.error("Failed to fetch sections", error);
    }
  };

  const addSection = async () => {
    if (!newTitle.trim()) return;
    try {
      const response = await axios.post(
        "http://localhost/eduplatform/api/sections.php",
        {
          training_plan_id: trainingPlanId,
          title: newTitle,
          content: newContent,
        }
      );

      if (response.data.success) {
        setSections([...sections, { id: response.data.id, title: newTitle, content: newContent }]);
        setNewTitle("");
        setNewContent("");
      }
    } catch (error) {
      console.error("Failed to add section", error);
    }
  };

  const updateSection = async (id, title, content) => {
    try {
      await axios.put("http://localhost/eduplatform/api/sections.php", {
        id,
        title,
        content,
      });
      fetchSections();
      setEditingSection(null);
    } catch (error) {
      console.error("Failed to update section", error);
    }
  };

  const deleteSection = async (id) => {
    try {
      await axios.delete("http://localhost/eduplatform/api/sections.php", {
        data: { id },
      });
      setSections(sections.filter((section) => section.id !== id));
    } catch (error) {
      console.error("Failed to delete section", error);
    }
  };

  return (
    <div>
      <h3>Manage Sections</h3>
      {sections.length === 0 && <p>No sections added yet.</p>}
      <ul>
        {sections.map((section) => (
          <li key={section.id}>
            {editingSection === section.id ? (
              <>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) =>
                    setSections(
                      sections.map((s) =>
                        s.id === section.id ? { ...s, title: e.target.value } : s
                      )
                    )
                  }
                />
                <textarea
                  value={section.content}
                  onChange={(e) =>
                    setSections(
                      sections.map((s) =>
                        s.id === section.id ? { ...s, content: e.target.value } : s
                      )
                    )
                  }
                />
                <button onClick={() => updateSection(section.id, section.title, section.content)}>
                  Save
                </button>
                <button onClick={() => setEditingSection(null)}>Cancel</button>
              </>
            ) : (
              <>
                <strong>{section.title}</strong>
                <p>{section.content}</p>
                <button onClick={() => setEditingSection(section.id)}>Edit</button>
                <button onClick={() => deleteSection(section.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h4>Add New Section</h4>
      <input
        type="text"
        placeholder="Section Title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <textarea
        placeholder="Section Content"
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
      />
      <button onClick={addSection}>Add Section</button>
    </div>
  );
};

export default ManageSections;
