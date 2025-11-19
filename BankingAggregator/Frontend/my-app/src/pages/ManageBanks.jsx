import React, { useEffect, useState } from "react";
import { listBanks, createBank, updateBank, deleteBank, createBranch } from "../services/bankService";

const ManageBanks = () => {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [bankForm, setBankForm] = useState({ name: '', swiftCode: '' });
  const [branchForm, setBranchForm] = useState({ name: '', address: '' });

  const loadBanks = async () => {
    try {
      const data = await listBanks();
      setBanks(data.items || data.Items || []);
    } catch (error) {
      alert("Failed to load banks");
    }
  };

  useEffect(() => {
    loadBanks();
  }, []);

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBank(bankForm);
      setShowBankModal(false);
      setBankForm({ name: '', swiftCode: '' });
      loadBanks();
    } catch (error) {
      alert("Failed to create bank: " + (error.response?.data?.message || error.message));
    }
  };

  const handleBranchSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBranch({ ...branchForm, bankId: selectedBank.id });
      setShowBranchModal(false);
      setBranchForm({ name: '', address: '' });
      loadBanks();
    } catch (error) {
      alert("Failed to create branch: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteBank = async (bankId) => {
    if (window.confirm("Are you sure you want to delete this bank?")) {
      try {
        await deleteBank(bankId);
        loadBanks();
      } catch (error) {
        alert("Delete failed: " + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Manage Banks</h1>
        <button className="btn btn-primary" onClick={() => setShowBankModal(true)}>
          Add Bank
        </button>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h4>Banks</h4>
          <div className="list-group">
            {banks.map(bank => (
              <div key={bank.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">{bank.name}</h6>
                    <small className="text-muted">SWIFT: {bank.swiftCode || 'N/A'}</small>
                  </div>
                  <div>
                    <button 
                      className="btn btn-sm btn-info me-1"
                      onClick={() => setSelectedBank(bank)}
                    >
                      View Branches
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteBank(bank.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-6">
          <h4>
            Branches {selectedBank && `- ${selectedBank.name}`}
            {selectedBank && (
              <button 
                className="btn btn-sm btn-success ms-2"
                onClick={() => setShowBranchModal(true)}
              >
                Add Branch
              </button>
            )}
          </h4>
          
          {selectedBank ? (
            <div className="list-group">
              {selectedBank.branches?.map(branch => (
                <div key={branch.id} className="list-group-item">
                  <h6 className="mb-1">{branch.name}</h6>
                  <small className="text-muted">{branch.address || 'No address'}</small>
                </div>
              ))}
              {(!selectedBank.branches || selectedBank.branches.length === 0) && (
                <div className="text-muted">No branches found</div>
              )}
            </div>
          ) : (
            <div className="text-muted">Select a bank to view branches</div>
          )}
        </div>
      </div>

      {/* Bank Modal */}
      {showBankModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Bank</h5>
                <button type="button" className="btn-close" onClick={() => setShowBankModal(false)}></button>
              </div>
              <form onSubmit={handleBankSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Bank Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={bankForm.name}
                      onChange={(e) => setBankForm({...bankForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">SWIFT Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={bankForm.swiftCode}
                      onChange={(e) => setBankForm({...bankForm, swiftCode: e.target.value})}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowBankModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">Create</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Branch Modal */}
      {showBranchModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Branch - {selectedBank?.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowBranchModal(false)}></button>
              </div>
              <form onSubmit={handleBranchSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Branch Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={branchForm.name}
                      onChange={(e) => setBranchForm({...branchForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      value={branchForm.address}
                      onChange={(e) => setBranchForm({...branchForm, address: e.target.value})}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowBranchModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">Create</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBanks;