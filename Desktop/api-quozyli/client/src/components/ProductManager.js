import React, { useState, useEffect } from 'react';
import '../assets/css/product-manager.css';
import ROUTES from '../app/routes/names';
import { NavLink } from 'react-router-dom';
import { useAddToReassort, useGetToReassort, useGetToReassortUpdated } from '../services/product-reassort-service';
import { toast } from 'react-toastify';
import Loader from './Loader';

const ProductManagement = () => {
    const [products, setProducts] = useState([
        { id: 1, url: "https://i.pinimg.com/736x/4d/8f/c4/4d8fc4fc3e490946a0e1fd7133d6b169.jpg", name: 'Produit A', description: 'Produit bien décrit', price: 19.99, stock: 50, inReassort: false },
        { id: 2, url: "https://i.pinimg.com/736x/a0/fb/87/a0fb8797a488ba64bdad33b998427ec4.jpg", name: 'Produit B', description: 'Produit bien décrit', price: 29.99, stock: 30, inReassort: false },
        { id: 3, url: "https://i.pinimg.com/736x/4d/8f/c4/4d8fc4fc3e490946a0e1fd7133d6b169.jpg", name: 'Produit C', description: 'Produit bien décrit', price: 39.99, stock: 20, inReassort: false },
        { id: 4, url: "https://i.pinimg.com/736x/a0/fb/87/a0fb8797a488ba64bdad33b998427ec4.jpg", name: 'Produit D', description: 'Produit bien décrit', price: 49.99, stock: 10, inReassort: false },
    ]);
    const [userId] = useState(10); // Fixe à 10 pour cet exemple
    const [selectedIds, setSelectedIds] = useState([]);

    const [addToReassortMutation] = useAddToReassort();
    const { data: reassortData, loading: reassortLoading, error: reassortError } = useGetToReassort(userId);
    const { data: reassortUpdatedData, loading: reassortUpdatedLoading } = useGetToReassortUpdated(reassortData?.getReassort?.id);
    const [reassortProducts,setReassortProducts]=useState([]);

    // Dynamiser le statut des produits et le compteur du réassort
    const isInReassort = (product_id) => {
     
        const isIn=reassortProducts.some((p) => p.product_id == product_id); 
    
        return isIn;
    };
    
    useEffect(() => {
        if (reassortData) {
            setReassortProducts(reassortData.getReassort.products);
         
            const reassortedProductIds = reassortData.getReassort.products.map((product) => product.product_id);
            setProducts((prevProducts) =>
                prevProducts.map((product) => ({
                    ...product,
                    inReassort: reassortedProductIds.includes(product.id),
                }))
            );
        }
    }, [reassortData]);

    // Mise à jour en temps réel des produits depuis la subscription
    useEffect(() => {
        if (reassortUpdatedData) {
            const updatedProduct = reassortUpdatedData.productUpdated;
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === updatedProduct.product_id
                        ? { ...product, stock: updatedProduct.stock_quantity, status: updatedProduct.status, inReassort: true }
                        : product
                )
            );
        }
    }, [reassortUpdatedData]);

    // Sélectionner/désélectionner un produit
    const toggleSelection = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    // Ajouter des produits au réassort
    const sendToReassort = async (ids) => {
        const selectedProducts = products.filter((product) => ids.includes(product.id));

        try {
            const promises = selectedProducts.map((product) =>
                addToReassortMutation({
                    variables: {
                        data: {
                            product_id: product.id,
                            price: product.price,
                            titre:product.name,
                            stock_quantity: product.stock,
                            description: product.description,
                            image_url: product.url,
                            user_id: userId
                        },
                    },
                })
            );
            await Promise.all(promises);

            // Mise à jour locale après succès
            setProducts((prev) =>
                prev.map((product) =>
                    ids.includes(product.id) ? { ...product, inReassort: true } : product
                )
            );
            setSelectedIds([]);
            toast.success("Produits ajoutés au réassort avec succès !");
        } catch (error) {
            toast.error(`Échec de l'ajout des produits au réassort: ${error.message}`);
        }
    };

    const reassortCount = reassortProducts.length + (
        products.filter((p) => p.inReassort).length > 0 
        ? products.filter((p) => p.inReassort).length 
        : 0
    );
    
    return (
        <div className="container">
            <header>
                <h1>Gestion des Produits</h1>
                <NavLink className="link" to={ROUTES.REASSORT}>
                    <div className="reassort-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>{reassortCount}</span>
                    </div>
                </NavLink>
            </header>
            <main>
                <div className="actions">
                    <button
                        className="pr-button"
                        onClick={() => sendToReassort(selectedIds)}
                        disabled={selectedIds.length === 0}
                    >
                        Ajouter au réassort ({selectedIds.length})
                    </button>
                </div>
                <div className="table-container">
                    {reassortLoading && reassortUpdatedLoading ? (
                        <Loader />
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Sélectionner</th>
                                    <th>Produit</th>
                                    <th>Titre</th>
                                    <th>Description</th>
                                    <th>Prix (€)</th>
                                    <th>Stock</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(product.id)}
                                                disabled={isInReassort(product?.id)}
                                                onChange={() => toggleSelection(product.id)}
                                            />
                                        </td>
                                        <td>
                                            <img className="round-image" src={product.url} alt="Produit" />
                                        </td>
                                        <td>{product.name}</td>
                                        <td>{product.description}</td>
                                        <td>{product.price.toFixed(2)}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                        {product?.inReassort || isInReassort(product?.id) ? (
                    <span className="in-reassort">Dans le réassort</span>
                ) : (
                    <button
                        className="pr-button"
                        onClick={() => sendToReassort([product.id])}
                    >
                        Ajouter
                    </button>
                )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProductManagement;
