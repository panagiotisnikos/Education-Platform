import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/InstructorAdminPanel.css"; 
import { FaBook, FaUpload, FaEdit, FaTrash,FaTrashAlt, FaTimes, FaEye, FaBookOpen } from "react-icons/fa";
import Swal from "sweetalert2";
import Modal from "react-modal";

const InstructorAdminPanel = () => {
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [sections, setSections] = useState({});
  const [selectedTrainingPlan, setSelectedTrainingPlan] = useState(null);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionContent, setNewSectionContent] = useState("");
  const [editingSection, setEditingSection] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const navigate = useNavigate();
  const [materials, setMaterials] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [pageHeight, setPageHeight] = useState("100vh");
  const [expandedSection, setExpandedSection] = useState(null); 
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [visibleMaterials, setVisibleMaterials] = useState({});
  useEffect(() => {
    fetchTrainingPlans();
  }, []);
  useEffect(() => {
    const updateHeight = () => {
      const contentHeight = document.getElementById("admin-content")?.scrollHeight || 0;
      setPageHeight(`${Math.max(contentHeight + 50, window.innerHeight)}px`);
    };
  
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [materials, sections]);
  
  //φερνω τα plans
  const fetchTrainingPlans = async () => {
    try {
      const response = await fetch("http://localhost/eduplatform/api/getTrainingPlans.php");
      const data = await response.json();
      setTrainingPlans(data);
    } catch (error) {
      console.error("Error fetching training plans:", error);
    }
  };

  //φερνω τα sections
  const fetchSections = async (trainingPlanId) => {
    try {
        const response = await fetch(`http://localhost/eduplatform/api/getSections.php?training_plan_id=${trainingPlanId}`);
        const data = await response.json();

        console.log("Sections API Response:", data);

        if (data.success && Array.isArray(data.sections)) {
            setSections((prev) => ({
                ...prev,
                [trainingPlanId]: data.sections.length > 0 ? data.sections : [],
            }));
        } else {
            setSections((prev) => ({ ...prev, [trainingPlanId]: [] }));
        }
    } catch (error) {
        console.error("Error fetching sections:", error);
        setSections((prev) => ({ ...prev, [trainingPlanId]: [] }));
    }
  };

  //Διαχείριση Επεξεργασίας Section
  const handleEditClick = (section) => {
      setEditingSection(section.id);
      setEditTitle(section.title);
      setEditContent(section.content);
  };
  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditTitle("");
    setEditContent("");
};
const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Title and Content cannot be empty!",
        });
        return;
    }

    try {
        const response = await fetch("http://localhost/eduplatform/api/editSection.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: editingSection,
                title: editTitle,
                content: editContent,
            }),
        });

        const data = await response.json();
        if (data.success) {
            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "The section has been updated successfully.",
                showConfirmButton: false,
                timer: 1500,
            });

            setEditingSection(null);
            fetchSections(selectedTrainingPlan);
        } else {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Failed to update section: " + data.error,
            });
        }
    } catch (error) {
        console.error("Error updating section:", error);
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "An error occurred while updating the section.",
        });
    }
};
const toggleMaterialsVisibility = (sectionId) => {
  setVisibleMaterials((prev) => ({
    ...prev,
    [sectionId]: !prev[sectionId]
  }));
};
const handleUploadFile = async (event, sectionId) => {
  if (!sectionId) {
    Swal.fire("Error!", "Invalid section. Try refreshing the page.", "error");
    return;
  }

  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("section_id", sectionId);

  console.log("Uploading file:", file.name);

  try {
    const response = await fetch("http://localhost/eduplatform/api/uploadMaterial.php", {
      method: "POST",
      body: formData,
    });

    const textResponse = await response.text();
    console.log("Raw Upload Response:", textResponse);

    try {
      const data = JSON.parse(textResponse);
      if (data.success) {
        Swal.fire("Success!", "File uploaded successfully!", "success");
        fetchMaterials(sectionId);
      } else {
        Swal.fire("Error!", data.message || "Upload failed", "error");
      }
    } catch (jsonError) {
      console.error("JSON Parse Error:", jsonError, "Response:", textResponse);
      Swal.fire("Error!", "Invalid response from server.", "error");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    Swal.fire("Error!", "An error occurred while uploading the file.", "error");
  }
};
const handleDeleteTrainingPlan = async (trainingPlanId) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch("http://localhost/eduplatform/api/deleteTrainingPlan.php", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: trainingPlanId }),
        });

        const data = await response.json();

        if (data.success) {
          Swal.fire("Deleted!", "The training plan has been deleted.", "success");
          setTrainingPlans((prev) => prev.filter((plan) => plan.id !== trainingPlanId));
        } else {
          Swal.fire("Error!", "Failed to delete training plan: " + data.error, "error");
        }
      } catch (error) {
        console.error("Error deleting training plan:", error);
        Swal.fire("Error!", "An error occurred while deleting the training plan.", "error");
      }
    }
  });
};



  

  //διαγραφω τα sections
  const handleDeleteSection = async (sectionId) => {
    Swal.fire({
        title: "Είστε σίγουρος;",
        text: "Η ενέργεια δεν θα μπορεί να αντιστραφεί!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ναι!",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch("http://localhost/eduplatform/api/deleteSection.php", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: sectionId }),
                });

                const data = await response.json();

                if (data.success) {
                    Swal.fire("Deleted!", "The section has been deleted.", "success");
                    setSections((prev) => ({
                        ...prev,
                        [selectedTrainingPlan]: prev[selectedTrainingPlan].filter((s) => s.id !== sectionId),
                    }));
                } else {
                    Swal.fire("Error!", "Failed to delete section: " + data.error, "error");
                }
            } catch (error) {
                console.error("Error deleting section:", error);
                Swal.fire("Error!", "An error occurred while deleting the section.", "error");
            }
        }
    });
};

  //προσθέτω sections
  const handleAddSection = async (trainingPlanId) => {
      if (!newSectionTitle || !newSectionContent) {
          alert("Παρακαλώ εισάγετε τίτλο και περιγραφή για το κεφάλαιο.");
          return;
      }

      try {
          const response = await fetch("http://localhost/eduplatform/api/addSection.php", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  training_plan_id: trainingPlanId,
                  title: newSectionTitle,
                  content: newSectionContent,
              }),
          });

          const data = await response.json();

          if (data.success) {
              setSections((prev) => ({
                  ...prev,
                  [trainingPlanId]: [...(prev[trainingPlanId] || []), { id: data.section_id, title: newSectionTitle, content: newSectionContent }],
              }));

              setNewSectionTitle("");
              setNewSectionContent("");
          } else {
              alert("Failed to add section.");
          }
      } catch (error) {
          console.error("Error adding section:", error);
          alert("An error occurred. Please try again.");
      }
  };
  const handleDeleteMaterial = async (fileId, sectionId) => {
    Swal.fire({
        title: "Είστε σίγουρος;",
        text: "Το αρχείο θα διαγραφεί οριστικά!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ναι",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch("http://localhost/eduplatform/api/deleteMaterial.php", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: fileId }),
                });

                const data = await response.json();

                if (data.success) {
                    Swal.fire("Διαγράφη Επιτυχής!", "The file has been deleted.", "success");
                    fetchMaterials(sectionId); // Ανανεώνει τα αρχεία του section
                } else {
                    Swal.fire("Error!", "Failed to delete file: " + data.error, "error");
                }
            } catch (error) {
                console.error("Error deleting file:", error);
                Swal.fire("Error!", "An error occurred while deleting the file.", "error");
            }
        }
    });
};

  const fetchMaterials = async (sectionId) => {
    try {
        const response = await fetch(`http://localhost/eduplatform/api/getMaterials.php?section_id=${sectionId}`);
        const data = await response.json();
        console.log("Fetched Materials:", data);
        if (data.success) {
            setMaterials((prev) => ({
                ...prev,
                [sectionId]: data.materials
            }));
        }
    } catch (error) {
        console.error("Error fetching materials:", error);
    }
};
  return (
  <div className="main-content">
    <div className="instructor-container" style={{ minHeight: pageHeight }}>


      {/* sidebar */}
      <aside className="sidebar">
      <h2 className="training-plans-title">Training Plans</h2>


        <ul>
          {trainingPlans.map((plan) => (
            <li
              key={plan.id}
              className={selectedTrainingPlan === plan.id ? "active" : ""}
              onClick={() => {
                setSelectedTrainingPlan(plan.id);
                fetchSections(plan.id);
              }}
            >
              {plan.title}
              <button className="cute-delete-btn" onClick={() => handleDeleteTrainingPlan(plan.id)}>
                  <FaTrashAlt />
                </button>
            </li>
          ))}
        </ul>
      </aside>

      
      <main className="content">
  {selectedTrainingPlan ? (
    <>
      <h2>Sections</h2>
      <ul className="section-list">
        {sections[selectedTrainingPlan] && sections[selectedTrainingPlan].length > 0 ? (
          sections[selectedTrainingPlan].map((section) => (
            <li key={section.id} className="section-item">
              <FaBook className="section-icon" />
              <div className="section-header">
                <span className="section-title">{section.title}</span>
              </div>

              <input type="file" onChange={(e) => handleUploadFile(e, section.id)} hidden id={`upload-${section.id}`} />
              <div className="section-actions">
                <div className="upload-view-buttons">
                  <label htmlFor={`upload-${section.id}`} className={`upload-btn ${expandedSection === section.id ? "small" : ""}`}>
                    <FaUpload /> Ανέβασμα Αρχείου
                  </label>
                  <button className="file-btn" onClick={() => fetchMaterials(section.id)}>
                      <FaEye /> Προβολή Αρχείων
                    </button>
                </div>
                
                {materials[section.id] && materials[section.id].length > 0 ? null : (
                        <p>Επιλέξτε "Προβολή Αρχείων" για να δείτε τα αρχεία που έχουν ανέβει στην κάθε ενότητα.</p>
                      )}
              </div>

              {/* προβολη αρχειων */}
              {materials[section.id] && materials[section.id].length > 0 ? (
                <ul>
                  {materials[section.id].map((file) => (
                    <li key={file.id}>
                      {file.file_path}
                      <button class="delete-file-btn" onClick={() => handleDeleteMaterial(file.id, section.id)}>
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p></p>
              )}

              {editingSection === section.id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Edit Title"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => {
                      setEditContent(e.target.value);
                      e.target.style.height = "auto"; 
                      e.target.style.height = e.target.scrollHeight + "px"; // οριζω νεο υψος
                    }}
                    placeholder="Edit Content"
                    className="dynamic-textarea"
                  />
                  <div className="edit-buttons">
                    <button className="save-btn" onClick={handleSaveEdit}>Αποθήκευση</button>
                    <button className="cancel-btn" onClick={handleCancelEdit}>
                      <FaTimes /> Ακύρωση
                    </button>
                  </div>
                </>
              ) : (
                <div className="section-actions">
                  <button className="button-secondary icon-button" onClick={() => handleEditClick(section)}>
                    <FaEdit /> Τροποποίηση
                  </button>
                  <button className="button-danger icon-button" onClick={() => handleDeleteSection(section.id)}>
                    <FaTrash /> Διαγραφή
                  </button>
                </div>
              )}
            </li>
          ))
        ) : (
          <p className="no-sections">No sections available.</p>
        )}
      </ul>

      {/* προσθηκη section */}
      <div className="add-section">
        <h3>Προσθήκη Κεφαλαίου</h3>
        <input type="text" value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)} placeholder="Section Title" />
        <textarea value={newSectionContent} onChange={(e) => setNewSectionContent(e.target.value)} placeholder="Section Content" />
        <button className="button-primary icon-button" onClick={() => handleAddSection(selectedTrainingPlan)}>
          + Προσθήκη
        </button>
      </div>
    </>
  ) : (
    <p>Επιλέξτε το εκπαιδευτικό πλάνο που θέλετε να διαχειριστείτε.</p>
  )}
</main>

    </div>
    </div>
  );
};

export default InstructorAdminPanel;






















