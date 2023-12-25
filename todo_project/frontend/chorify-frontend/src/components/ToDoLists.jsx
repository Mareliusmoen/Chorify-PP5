import React, { useState, useEffect } from 'react';

const ToDoLists = () => {
    const [toDoLists, setToDoLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newToDoListDescription, setNewToDoListDescription] = useState('');
    const [newToDoListDueDate, setNewToDoListDueDate] = useState('');
    const [newToDoListDone, setNewToDoListDone] = useState(false);
    const [editingToDoList, setEditingToDoList] = useState(null);

    useEffect(() => {
        const fetchToDoLists = async () => {
            try {
                const token = localStorage.getItem('Token');
                const response = await fetch(`/api/todo-lists/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`,
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    const result = await response.json();
                    setToDoLists(result);
                } else {
                    throw new Error('Network response was not ok for to-do lists.');
                }
            } catch (error) {
                console.error('There has been a problem with your fetch operation for to-do lists:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchToDoLists();
    }, []);

    const createToDoList = async () => {
        try {
            const token = localStorage.getItem('Token');
            const response = await fetch(`/api/todo-lists/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({
                    description: newToDoListDescription,
                    due_date: newToDoListDueDate,
                    done: newToDoListDone,
                }),
                credentials: 'include',
            });

            if (response.ok) {
                const result = await response.json();
                setToDoLists((prevLists) => [...prevLists, result]);
                setNewToDoListDescription('');
                setNewToDoListDueDate('');
                setNewToDoListDone(false); // Reset the done state
            } else {
                throw new Error('Network response was not ok for creating a to-do list.');
            }
        } catch (error) {
            console.error('There has been a problem with your create operation for to-do list:', error);
        }
    };

    const startEditing = (toDoList) => {
        setEditingToDoList(toDoList);
    };

    const editToDoList = async (editedToDoList) => {
        try {
            const token = localStorage.getItem('Token');
            const response = await fetch(`/api/todo-lists/${editedToDoList.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify(editedToDoList),
                credentials: 'include',
            });

            if (response.ok) {
                const updatedList = await response.json();
                setToDoLists((prevLists) =>
                    prevLists.map((list) => (list.id === updatedList.id ? updatedList : list))
                );
                setEditingToDoList(null); // Reset the editing state after a successful edit
            } else {
                throw new Error('Network response was not ok for editing a to-do list.');
            }
        } catch (error) {
            console.error('There has been a problem with your edit operation for to-do list:', error);
        }
    };

    const deleteToDoList = async (toDoListId) => {
        try {
            const token = localStorage.getItem('Token');
            const response = await fetch(`/api/todo-lists/${toDoListId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                credentials: 'include',
            });

            if (response.ok) {
                setToDoLists((prevLists) => prevLists.filter((list) => list.id !== toDoListId));
            } else {
                throw new Error('Network response was not ok for deleting a to-do list.');
            }
        } catch (error) {
            console.error('There has been a problem with your delete operation for to-do list:', error);
        }
    };
    const handleCheckboxChange = async (toDoListId, isChecked) => {
        try {
            const token = localStorage.getItem('Token');
            const response = await fetch(`/api/todo-lists/${toDoListId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({ done: isChecked }),
                credentials: 'include',
            });

            if (response.ok) {
                const updatedList = await response.json();
                setToDoLists((prevLists) =>
                    prevLists.map((list) => (list.id === updatedList.id ? updatedList : list))
                );
            } else {
                throw new Error('Network response was not ok for updating a to-do list.');
            }
        } catch (error) {
            console.error('There has been a problem with your update operation for to-do list:', error);
        }
    };
    return (
        <div>
            <div className="mb-3">
                <button
                    type="button"
                    className="grey-button"
                    data-bs-toggle="modal"
                    data-bs-target="#createToDoModal"
                >
                    Create
                </button>
            </div>

            <ul className="list-group">
                {toDoLists.map((toDoList) => (
                    <li key={toDoList.id} className="list-group-item">
                        <div className="d-flex flex-column justify-content-between align-items-center">
                            <div className=''>
                                <span>{toDoList.due_date}</span>
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    className="form-check-input me-3"
                                    id={`doneCheckbox_${toDoList.id}`}
                                    checked={toDoList.done}
                                    onChange={(e) => handleCheckboxChange(toDoList.id, e.target.checked)}
                                />
                                <span>{toDoList.description}</span>
                                <button
                                    type="button"
                                    className="btn btn-warning btn-sm ms-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editToDoModal"
                                    onClick={() => startEditing(toDoList)}
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm ms-2"
                                    onClick={() => deleteToDoList(toDoList.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            {/* Create ToDo List Modal */}
            <div className="modal" id="createToDoModal">
                <div className="modal-dialog">
                    <div className="modal-content">

                        {/* Modal Header */}
                        <div className="modal-header">
                            <h5 className="modal-title">Create ToDo List</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body">
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ToDo List Description"
                                    id="newToDoListDescription"
                                    value={newToDoListDescription}
                                    onChange={(e) => setNewToDoListDescription(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <input
                                    type="date"
                                    className="form-control"
                                    id="newToDoListDueDate"
                                    value={newToDoListDueDate}
                                    onChange={(e) => setNewToDoListDueDate(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="modal-footer">
                            <button type="button" className="create-button" onClick={createToDoList} data-bs-dismiss="modal">
                                Create
                            </button>
                            <button type="button" className="close-button" data-bs-dismiss="modal">
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Edit ToDo List Modal */}
            {editingToDoList && (
                <div className="modal" id="editToDoModal">
                    <div className="modal-dialog">
                        <div className="modal-content">

                            {/* Modal Header */}
                            <div className="modal-header">
                                <h5 className="modal-title">Edit ToDo List</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>

                            {/* Modal Body */}
                            <div className="modal-body">
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="ToDo List Description"
                                        value={editingToDoList.description}
                                        onChange={(e) => setEditingToDoList({ ...editingToDoList, description: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={editingToDoList.due_date}
                                        onChange={(e) => setEditingToDoList({ ...editingToDoList, due_date: e.target.value })}
                                    />
                                </div>

                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="editDoneCheckbox"
                                        checked={editingToDoList.done}
                                        onChange={(e) => setEditingToDoList({ ...editingToDoList, done: e.target.checked })}
                                    />
                                    <label className="form-check-label" htmlFor="editDoneCheckbox">
                                        Done
                                    </label>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={() => editToDoList(editingToDoList)} data-bs-dismiss="modal">
                                    Save Changes
                                </button>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ToDoLists;
