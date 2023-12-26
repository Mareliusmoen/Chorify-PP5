import React, { useState, useEffect } from 'react';

/**
 * Represents a component that manages shopping lists.
 * It allows users to create, edit, and delete shopping lists, and manage items within these lists.
 */
const ShoppingLists = () => {
    const [shoppingLists, setShoppingLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newShoppingListName, setNewShoppingListName] = useState('');
    const [newShoppingListItems, setNewShoppingListItems] = useState([{ item: '', quantity: '' }]);
    const [editingShoppingList, setEditingShoppingList] = useState(null);



    useEffect(() => {
        /**
         * Asynchronously fetches shopping lists from the server,
         * using the stored authentication token. If the response is
         * successful, it updates the shopping lists state; otherwise,
         * logs an error. Finally, sets the loading state to false.
         */
        const fetchShoppingLists = async () => {
            try {
                const token = localStorage.getItem('Token');

                const response = await fetch(`/api/shopping-lists/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`,
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    const result = await response.json();
                    setShoppingLists(result);
                } else {
                    throw new Error('Network response was not ok for shopping lists.');
                }
            } catch (error) {
                console.error('There has been a problem with your fetch operation for shopping lists:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchShoppingLists();
    }, []);

    /**
     * Asynchronously creates a new shopping list by posting the 
     * new list's name and items to the server. It uses the Token 
     * from localStorage for authorization. Updates the shopping 
     * lists state with the new list on a successful response and 
     * resets the input fields. Logs an error in the console if 
     * the operation fails.
     *
     * @param {String} newShoppingListName - Name for the new list.
     * @param {Array} newShoppingListItems - Items to add to the new list.
     * @return {void}
     */
    const createShoppingList = async () => {
        try {
            const token = localStorage.getItem('Token');
            const response = await fetch(`/api/shopping-lists/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({
                    name: newShoppingListName,
                    items: newShoppingListItems.map(({ item, quantity }) => ({ item, quantity })),
                }),
                credentials: 'include',
            });

            if (response.ok) {
                const result = await response.json();
                setShoppingLists((prevLists) => [...prevLists, result]);
                setNewShoppingListName('');
                setNewShoppingListItems([{ item: '', quantity: '' }]); // Reset the items state
            } else {
                throw new Error('Network response was not ok for creating a shopping list.');
            }
        } catch (error) {
            console.error('There has been a problem with your create operation for shopping list:', error);
        }
    };



    /**
     * Initiates the editing process for a given
     * shopping list.
     *
     * @param {Object} shoppingList - The shopping 
     *     list to be edited.
     * @return {void}
     */
    const startEditing = (shoppingList) => {
        setEditingShoppingList(shoppingList);
    };
    
    /**
     * Asynchronously edits a shopping list item using an API call and
     * updates the local shopping lists state.
     *
     * @param {Object} editedShoppingList - The updated shopping list object
     *                                      with an id property.
     * @return {void} No return value.
     */
    const editShoppingList = async (editedShoppingList) => {
        try {
            const token = localStorage.getItem('Token');
            const response = await fetch(`/api/shopping-lists/${editedShoppingList.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify(editedShoppingList),
                credentials: 'include',
            });

            if (response.ok) {
                const updatedList = await response.json();
                setShoppingLists((prevLists) =>
                    prevLists.map((list) => (list.id === updatedList.id ? updatedList : list))
                );
                setEditingShoppingList(null); // Reset the editing state after successful edit
            } else {
                throw new Error('Network response was not ok for editing a shopping list.');
            }
        } catch (error) {
            console.error('There has been a problem with your edit operation for shopping list:', error);
        }
    };

    /**
     * Asynchronously deletes a shopping list by its ID using
     * an API call with 'DELETE' method. Updates the state to
     * remove the deleted list. Handles possible errors by
     * logging them to the console.
     *
     * @param {string} shoppingListId - The ID of the shopping
     *     list to be deleted.
     * @return {void} No return value.
     */
    const deleteShoppingList = async (shoppingListId) => {
        try {
            const token = localStorage.getItem('Token');
            const response = await fetch(`/api/shopping-lists/${shoppingListId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                credentials: 'include',
            });

            if (response.ok) {
                setShoppingLists((prevLists) => prevLists.filter((list) => list.id !== shoppingListId));
            } else {
                throw new Error('Network response was not ok for deleting a shopping list.');
            }
        } catch (error) {
            console.error('There has been a problem with your delete operation for shopping list:', error);
        }
    };


    return (
        <div>
            <div className="mb-3">
                <button
                    type="button"
                    className="grey-button"
                    data-bs-toggle="modal"
                    data-bs-target="#createModal"
                >
                    Create
                </button>
            </div>

            <ul className="list-group">
                {shoppingLists.map((shoppingList) => (
                    <li key={shoppingList.id} className="list-group-item">
                        <a href={`#${shoppingList.id}`} className="text-decoration-none" data-bs-toggle="collapse">
                            {shoppingList.name}
                        </a>

                        <div className="collapse" id={shoppingList.id}>
                            <ul className="list-group">
                                {Array.isArray(shoppingList.items) ? (
                                    shoppingList.items.map((item, index) => (
                                        <li key={index} className="list-group-item">
                                            {typeof item.item === 'object' ? JSON.stringify(item.item) : `${item.item} - ${item.quantity}`}
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item">
                                        {Object.entries(shoppingList.items).map(([itemName, quantity], index) => (
                                            <div key={index}>
                                                {typeof itemName === 'object' ? JSON.stringify(itemName) : `${itemName} - ${quantity}`}
                                            </div>
                                        ))}
                                    </li>
                                )}
                            </ul>
                        </div>

                        <div className="d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-warning btn-sm ms-2"
                                data-bs-toggle="modal"
                                data-bs-target="#editModal"
                                onClick={() => startEditing(shoppingList)}
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger btn-sm ms-2"
                                onClick={() => deleteShoppingList(shoppingList.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Create Shopping List Modal */}
            <div className="modal" id="createModal">
                <div className="modal-dialog">
                    <div className="modal-content">

                        {/* Modal Header */}
                        <div className="modal-header">
                            <h5 className="modal-title">Create Shopping List</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body">
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Shopping List Name"
                                    id="newShoppingListName"
                                    value={newShoppingListName}
                                    onChange={(e) => setNewShoppingListName(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                {newShoppingListItems.map((pair, index) => (
                                    <div key={index} className="d-flex mb-2">
                                        <input
                                            type="text"
                                            className="form-control me-2"
                                            placeholder="Item"
                                            value={pair.item}
                                            onChange={(e) => {
                                                const updatedItems = [...newShoppingListItems];
                                                updatedItems[index].item = e.target.value;
                                                setNewShoppingListItems(updatedItems);
                                            }}
                                        />
                                        <input
                                            type="text"
                                            className="form-control me-2"
                                            placeholder="Quantity"
                                            value={pair.quantity}
                                            onChange={(e) => {
                                                const updatedItems = [...newShoppingListItems];
                                                updatedItems[index].quantity = e.target.value;
                                                setNewShoppingListItems(updatedItems);
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => {
                                                const updatedItems = [...newShoppingListItems];
                                                updatedItems.splice(index, 1);
                                                setNewShoppingListItems(updatedItems);
                                            }}
                                        >
                                            -
                                        </button>
                                        {index === newShoppingListItems.length - 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary btn-sm ms-2"
                                                onClick={() => setNewShoppingListItems([...newShoppingListItems, { item: '', quantity: '' }])}
                                            >
                                                +
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="modal-footer">
                            <button type="button" className="create-button" onClick={createShoppingList} data-bs-dismiss="modal">
                                Create
                            </button>
                            <button type="button" className="close-button" data-bs-dismiss="modal">
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Edit Shopping List Modal */}
            {editingShoppingList && (
                <div className="modal" id="editModal">
                    <div className="modal-dialog">
                        <div className="modal-content">

                            {/* Modal Header */}
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Shopping List</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>

                            {/* Modal Body */}
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="editShoppingListName" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="editShoppingListName"
                                        value={editingShoppingList.name}
                                        onChange={(e) => setEditingShoppingList({ ...editingShoppingList, name: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="editShoppingListItem" className="form-label">Item</label>
                                    <label htmlFor="editShoppingListQuantity" className="form-label ms-2">Quantity</label>
                                    {editingShoppingList.items.map((pair, index) => (
                                        <div key={index} className="d-flex mb-2">
                                            <input
                                                type="text"
                                                className="form-control me-2"
                                                placeholder="Item"
                                                value={pair.item}
                                                onChange={(e) => {
                                                    const updatedItems = [...editingShoppingList.items];
                                                    updatedItems[index].item = e.target.value;
                                                    setEditingShoppingList({ ...editingShoppingList, items: updatedItems });
                                                }}
                                            />
                                            <input
                                                type="text"
                                                className="form-control me-2"
                                                placeholder="Quantity"
                                                value={pair.quantity}
                                                onChange={(e) => {
                                                    const updatedItems = [...editingShoppingList.items];
                                                    updatedItems[index].quantity = e.target.value;
                                                    setEditingShoppingList({ ...editingShoppingList, items: updatedItems });
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => {
                                                    const updatedItems = [...editingShoppingList.items];
                                                    updatedItems.splice(index, 1);
                                                    setEditingShoppingList({ ...editingShoppingList, items: updatedItems });
                                                }}
                                            >
                                                -
                                            </button>
                                            {index === editingShoppingList.items.length - 1 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary btn-sm ms-2"
                                                    onClick={() => {
                                                        const updatedItems = [...editingShoppingList.items, { item: '', quantity: '' }];
                                                        setEditingShoppingList({ ...editingShoppingList, items: updatedItems });
                                                    }}
                                                >
                                                    +
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="modal-footer">
                                <button type="button" className="create-button" onClick={() => editShoppingList(editingShoppingList)} data-bs-dismiss="modal">
                                    Save Changes
                                </button>
                                <button type="button" className="close-button" data-bs-dismiss="modal">
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

export default ShoppingLists;
