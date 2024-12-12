import React, { useState, useEffect } from "react";
import "../assets/css/reassort.css";
import { Modal, Button } from "react-bootstrap";
import {
  useGetToReassort,
  useGetToReassortUpdated,
  useUpdateQuantity,
  useToggleState,
  useDestroyProduct,
} from "../services/product-reassort-service";
import Loader from "./Loader";
import { toast } from "react-toastify";

const ReassortProduct = () => {
  const [userId] = useState(10);
  const [reassortProducts, setReassortProducts] = useState([]);
  const [isAutomatic, setIsAutomatic] = useState(null);
  const [modal, setModal] = useState({ visible: false, product: null });
  // Fetch initial reassort data
  const [updateQuantityMutation] = useUpdateQuantity();
  const [toggleSateMutation] = useToggleState();
  const [destroyProduct] = useDestroyProduct();
  const {
    data: reassortData,
    loading: reassortLoading,
    error: reassortError,
  } = useGetToReassort(userId);

  // Fetch updates for reassort
  const { data: reassortUpdatedData, loading: reassortUpdatedLoading } =
    useGetToReassortUpdated(reassortData?.getReassort?.id);
  const reaData = reassortUpdatedData?.productUpdated?.reassort || reassortData?.getReassort;
   
  const openModal = (product) => {
    if (product.echeance >= 3) {
      setModal({ visible: true, product });
    } else {
      toast.warn(
        "L'échéance du produit doit être supérieure ou égale à 3 jours pour effectuer cette action."
      );
    }
  };

  const closeModal = () => setModal({ visible: false, product: null });
  useEffect(() => {
    if (reaData?.state) {
      setIsAutomatic(reaData?.state === "automatic");
    }
  }, [reaData]);
  const handleUpdateQuantity = async () => {
    try {
      const { data } = await updateQuantityMutation({
        variables: {
          productId: modal.product.id,
          quantity: modal.product.stock_quantity,
        },
      });

      // Mettre à jour la quantité dans la liste locale après une mutation réussie
      setReassortProducts((prev) =>
        prev.map((product) =>
          product.id === modal.product.id
            ? { ...product, stock_quantity: modal.product.stock_quantity }
            : product
        )
      );

      toast.success("Quantité mise à jour avec succès !");
      closeModal();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la quantité.");
    }
  };

  // Handle initial data loading
  useEffect(() => {
    if (reaData?.products) {
      setReassortProducts(
        reaData?.products.map((product) => ({
          ...product,
          selected: false, // Add selection state for checkbox
        }))
      );
    }
  }, [reaData]);
 
  const handleToggleState = async () => {
    try {
      const { data } = await toggleSateMutation({
        variables: {
          reassortId: reaData?.id,
        },
      });

      // Mettre à jour l'état local en fonction de la réponse du serveur
      if (data?.toggleState?.state) {
        setIsAutomatic(data.toggleState.state === "automatic");
        toast.success("État modifié avec succès !");
      }
    } catch (error) {
      toast.error("Erreur pendant la mise à jour de l'état");
    }
  };

  useEffect(() => {
    if (reaData?.products) {
      setReassortProducts(
        reaData?.products.map((product) => ({
          ...product,
          selected: false, // Maintain selection state
        }))
      );
    }
  }, [reaData]);

  // Handlers for UI interactions

  const deleteProduct = async (product) => {
    try {
      // Appeler la mutation destroyProduct

      const { data } = await destroyProduct({
        variables: {
          data: {
            user_id: userId,
            reassort_id: reaData?.id,
            product_id: product?.id,
          },
        },
      });

      if (data) {
        // Mettre à jour l'état local en supprimant le produit
        setReassortProducts((prev) =>
          prev.filter((item) => item.id !== product.id)
        );
        toast.success("Produit supprimé avec succès !");
      } else {
        toast.error(
          data?.destroyProduct?.message ||
            "Erreur lors de la suppression du produit."
        );
      }
    } catch (error) {
      toast.error(`Une erreur est survenue pendant la suppression.${error}`);
    }
  };

  const toggleProductSelection = (id) => {
    setReassortProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, selected: !product.selected }
          : product
      )
    );
  };
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date)) {
      return ""; // Retourne une chaîne vide si la date est invalide
    }
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const toggleSelectAll = (checked) => {
    setReassortProducts((prev) =>
      prev.map((product) => ({ ...product, selected: checked }))
    );
  };

  const isAllSelected = reassortProducts.every((product) => product.selected);

  if (reassortLoading && reassortUpdatedLoading) {
    return <Loader />;
  }

  if (reassortError) {
    return (
      <div className="error">
        Une erreur est survenue lors du chargement des produits.
      </div>
    );
  }

  return (
    <div className="rea-r-container">
      <div className="d-flex justify-content-between">
        <div className="text">Mon reassort</div>
        <div className="rea-r-mode-switch">
          <label className="rea-r-switch">
            <input
              type="checkbox"
              checked={isAutomatic || false}
              onChange={handleToggleState}
            />

            <span className="rea-r-slider"></span>
          </label>
          <span className="rea-r-mode-label">
            {isAutomatic ? "Mode Automatique" : "Mode Manuel"}
          </span>
        </div>
      </div>
      <table className="rea-r-table">
        <thead>
          <tr>
            <th className="rea-r-checkbox-wrapper">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => toggleSelectAll(e.target.checked)}
              />
            </th>
            <th>Produit</th>
            <th>Titre</th>
            <th>Prix</th>
            <th>Quantité</th>
            <th>Date d'ajout</th>
            {isAutomatic && <th>Echéance</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reassortProducts.map((product) => (
            <tr key={product.id}>
              <td className="rea-r-checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={product.selected}
                  onChange={() => toggleProductSelection(product.id)}
                />
              </td>
              <td data-label="Image">
                <div className="rea-r-product-info">
                  <img
                    src={product.image_url || "https://via.placeholder.com/50"}
                    alt={product.name}
                  />
                </div>
              </td>
              <td data-label="Produit">{product?.titre}</td>
              <td data-label="Prix">{product.price}€</td>
              <td data-label="Quantité">
                <div className="rea-r-quantity-control d-flex">
                  {/* <button onClick={() => updateQuantity(product.id, -1)}>-</button> */}
                  <span>{product.stock_quantity || 1}</span>
                  <button
                    className="d-flex mx-4"
                    onClick={() => openModal(product)}
                  >
                    <span className="bi bi-arrow-up text-success"></span>
                    <span className="bi bi-arrow-down text-danger"></span>
                  </button>
                </div>
              </td>
              <td data-label="Date">{formatDate(product?.date_added)}</td>
              {isAutomatic && (
                <td data-label="Echéance">
                  <span className="js-d text-center">
                    {product.echeance || "N/A"}jour(s)
                  </span>
                </td>
              )}
              <td data-label="Actions">
                <button
                  className="rea-r-delete-btn"
                  onClick={() => deleteProduct(product)}
                >
                  <span className="bi bi-trash fs-4"></span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={modal.visible} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Mettre à jour la quantité</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Quantité</label>
            <input
              type="number"
              value={modal.product?.stock_quantity || 1}
              min="0"
              onChange={(e) =>
                setModal((prev) => ({
                  ...prev,
                  product: { ...prev.product, stock_quantity: +e.target.value },
                }))
              }
              className="form-control"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleUpdateQuantity}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReassortProduct;
