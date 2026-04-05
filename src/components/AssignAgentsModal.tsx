
import { useState } from 'react';
import { X, Search, User, UserCheck, XCircle } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  ticketCount: number;
}

interface AssignAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (agentId: string, agentName: string) => void;
  ticketIds: string[];
  currentAssignedTo?: string;
}

const AssignAgentModal = ({ 
  isOpen, 
  onClose, 
  onAssign, 
  ticketIds,
  currentAssignedTo 
}: AssignAgentModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // Mock agents list - replace with your actual agents from Redux/API
  const agents: Agent[] = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah.johnson@supporthub.com', avatar: 'SJ', role: 'Senior Agent', ticketCount: 8 },
    { id: '2', name: 'Mike Chen', email: 'mike.chen@supporthub.com', avatar: 'MC', role: 'Support Agent', ticketCount: 12 },
    { id: '3', name: 'Emily Rodriguez', email: 'emily.rodriguez@supporthub.com', avatar: 'ER', role: 'Support Agent', ticketCount: 6 },
    { id: '4', name: 'David Kim', email: 'david.kim@supporthub.com', avatar: 'DK', role: 'Junior Agent', ticketCount: 15 },
    { id: '5', name: 'Lisa Patel', email: 'lisa.patel@supporthub.com', avatar: 'LP', role: 'Support Agent', ticketCount: 9 },
    { id: '6', name: 'Alex Turner', email: 'alex.turner@supporthub.com', avatar: 'AT', role: 'Senior Agent', ticketCount: 4 },
    { id: '7', name: 'Jessica Lee', email: 'jessica.lee@supporthub.com', avatar: 'JL', role: 'Support Agent', ticketCount: 11 },
  ];

  // Filter agents based on search
  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssign = () => {
    if (selectedAgentId) {
      const selectedAgent = agents.find(a => a.id === selectedAgentId);
      if (selectedAgent) {
        onAssign(selectedAgentId, selectedAgent.name);
        onClose();
        setSelectedAgentId(null);
        setSearchQuery('');
      }
    }
  };

  const handleUnassign = () => {
    onAssign('', 'Unassigned');
    onClose();
  };

  if (!isOpen) return null;

  const ticketCount = ticketIds.length;
  const ticketText = ticketCount === 1 ? 'ticket' : 'tickets';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Assign Ticket{ticketCount > 1 ? 's' : ''}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {ticketCount} {ticketText} selected
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-5 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search agents by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Agents List - Scrollable */}
          <div className="max-h-80 overflow-y-auto">
            {filteredAgents.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredAgents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between group ${
                      selectedAgentId === agent.id ? 'bg-purple-50' : ''
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3 ${
                        selectedAgentId === agent.id 
                          ? 'bg-purple-600' 
                          : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                      }`}>
                        {agent.avatar}
                      </div>
                      
                      {/* Agent Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                          {agent.role === 'Senior Agent' && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">Senior</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{agent.email}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xs text-gray-400">{agent.role}</p>
                          <span className="text-xs text-gray-300">•</span>
                          <p className="text-xs text-gray-400">{agent.ticketCount} active tickets</p>
                        </div>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {selectedAgentId === agent.id && (
                      <UserCheck size={18} className="text-purple-600 ml-3" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-5 py-12 text-center">
                <User size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No agents found</p>
                <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Unassign Option */}
          {currentAssignedTo && currentAssignedTo !== 'Unassigned' && (
            <div className="border-t border-gray-100">
              <button
                onClick={handleUnassign}
                className="w-full px-5 py-4 text-left hover:bg-red-50 transition-colors flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <XCircle size={18} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600">Unassign</p>
                  <p className="text-xs text-gray-500">Remove current assignment</p>
                </div>
              </button>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedAgentId}
              className="px-5 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              <UserCheck size={16} />
              Assign {ticketCount > 1 ? `(${ticketCount})` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignAgentModal;