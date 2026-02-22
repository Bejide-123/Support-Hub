// // pages/AgentTicketDetailPage.tsx
// import { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   ArrowLeft,
//   MessageSquare,
//   Paperclip,
//   Send,
//   CheckCircle,
//   MoreVertical,
//   Download,
//   ChevronDown,
//   Tag,
//   Calendar,
//   Edit,
//   Trash2,
//   UserPlus,
//   Archive,
//   Copy,
//   Phone,
//   Mail,
//   Star,
//   AlertTriangle,
//   X,
//   FileText,
//   Image as ImageIcon,
//   Users,
//   Ticket
// } from 'lucide-react';
// import AgentNavbar from '../components/AgentNavbar';

// const AgentTicketDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [newMessage, setNewMessage] = useState('');
//   const [showStatusDropdown, setShowStatusDropdown] = useState(false);
//   const [showAssignDropdown, setShowAssignDropdown] = useState(false);
//   const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
//   const [showMoreActions, setShowMoreActions] = useState(false);
//   const [showSlaWarning, setShowSlaWarning] = useState(true);
//   const [activeTab, setActiveTab] = useState('conversation');
//   const [internalNote, setInternalNote] = useState('');
//   const [showInternalNote, setShowInternalNote] = useState(false);

//   // Mock ticket data
//   const ticket = {
//     id: 'TKT-1242',
//     subject: 'Subscription downgrade not reflecting',
//     status: 'in-progress',
//     priority: 'high',
//     category: 'Billing',
//     created: '2024-03-14T09:23:00',
//     updated: '1 hour ago',
//     customer: {
//       name: 'Sarah Miller',
//       email: 'sarah.miller@email.com',
//       phone: '+1 (555) 123-4567',
//       company: 'Miller Designs',
//       avatar: 'SM',
//       memberSince: 'Jan 15, 2024',
//       totalTickets: 3,
//       satisfaction: 98
//     },
//     assignedTo: {
//       name: 'Sarah Johnson',
//       avatar: 'SJ',
//       role: 'Senior Support Agent'
//     },
//     description: 'I downgraded my subscription from Pro to Basic 3 days ago, but my account still shows Pro features and I was charged the Pro rate this month. Please fix this issue and refund the difference.',
//     attachments: [
//       { name: 'invoice-march-2024.pdf', size: '245 KB', type: 'pdf' },
//       { name: 'subscription-screenshot.png', size: '1.2 MB', type: 'image' }
//     ],
//     tags: ['subscription', 'billing', 'refund'],
//     sla: {
//       response: '2 hours',
//       resolution: '24 hours',
//       breached: false
//     },
//     satisfaction: null
//   };

//   // Mock conversation thread
//   const messages = [
//     {
//       id: 1,
//       author: 'Sarah Miller',
//       avatar: 'SM',
//       role: 'customer',
//       message: 'I downgraded my subscription from Pro to Basic 3 days ago, but my account still shows Pro features and I was charged the Pro rate this month. Please fix this issue and refund the difference.',
//       timestamp: '2024-03-14 09:23 AM',
//       isCustomer: true,
//       attachments: []
//     },
//     {
//       id: 2,
//       author: 'Sarah Johnson',
//       avatar: 'SJ',
//       role: 'agent',
//       message: 'Hi Sarah, I\'m sorry to hear about the billing issue. Let me look into your account and see what happened with the downgrade. I can see you made the change on March 11th. Could you confirm the last four digits of the card on file?',
//       timestamp: '2024-03-14 10:45 AM',
//       isCustomer: false,
//       isInternal: false,
//       attachments: []
//     },
//     {
//       id: 3,
//       author: 'Sarah Miller',
//       avatar: 'SM',
//       role: 'customer',
//       message: 'The card ends in 4242. It\'s the same card I\'ve always used.',
//       timestamp: '2024-03-14 11:15 AM',
//       isCustomer: true,
//       attachments: []
//     },
//     {
//       id: 4,
//       author: 'Sarah Johnson',
//       avatar: 'SJ',
//       role: 'agent',
//       message: 'Thank you for confirming. I\'ve found the issue - there was a sync error between our billing system and the subscription service. I\'ve manually applied the downgrade and processed a refund for the difference. You should see the credit within 3-5 business days.',
//       timestamp: '2024-03-14 01:30 PM',
//       isCustomer: false,
//       isInternal: false,
//       attachments: []
//     },
//     {
//       id: 5,
//       author: 'Sarah Johnson',
//       avatar: 'SJ',
//       role: 'agent',
//       message: 'Note: Refund processed - amount $29.99. Need to follow up with engineering about the sync error.',
//       timestamp: '2024-03-14 01:32 PM',
//       isCustomer: false,
//       isInternal: true,
//       attachments: []
//     }
//   ];

//   // Mock suggested articles
//   const suggestedArticles = [
//     { title: 'How to change subscription plans', url: '#' },
//     { title: 'Understanding billing cycles', url: '#' },
//     { title: 'Refund policy and processing times', url: '#' }
//   ];

//   // Mock customer history
//   const customerHistory = [
//     { id: 'TKT-1189', subject: 'Login issues', status: 'resolved', date: 'Feb 28, 2024' },
//     { id: 'TKT-1123', subject: 'Feature request: Dark mode', status: 'closed', date: 'Jan 15, 2024' },
//   ];

//   // Status badge component
//   const StatusBadge = ({ status }: { status: string }) => {
//     const styles = {
//       'open': 'bg-blue-100 text-blue-700 border-blue-200',
//       'in-progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
//       'resolved': 'bg-green-100 text-green-700 border-green-200',
//       'closed': 'bg-gray-100 text-gray-700 border-gray-200',
//       'urgent': 'bg-red-100 text-red-700 border-red-200',
//     };
    
//     return (
//       <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700'}`}>
//         {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
//       </span>
//     );
//   };

//   // Priority badge component
//   const PriorityBadge = ({ priority }: { priority: string }) => {
//     const styles = {
//       'urgent': 'bg-red-100 text-red-700 border-red-200',
//       'high': 'bg-orange-100 text-orange-700 border-orange-200',
//       'medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
//       'low': 'bg-green-100 text-green-700 border-green-200',
//     };
    
//     return (
//       <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${styles[priority as keyof typeof styles]}`}>
//         {priority.charAt(0).toUpperCase() + priority.slice(1)}
//       </span>
//     );
//   };

//   const handleSendMessage = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Message sent:', newMessage);
//     setNewMessage('');
//   };

//   const handleSendInternalNote = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Internal note:', internalNote);
//     setInternalNote('');
//     setShowInternalNote(false);
//   };

//   const closeAllDropdowns = () => {
//     setShowStatusDropdown(false);
//     setShowAssignDropdown(false);
//     setShowPriorityDropdown(false);
//     setShowMoreActions(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <AgentNavbar />
      
//       {/* SLA Warning Banner */}
//       {showSlaWarning && ticket.priority === 'high' && (
//         <div className="bg-orange-50 border-b border-orange-200">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <AlertTriangle size={18} className="text-orange-600 mr-2" />
//                 <span className="text-sm text-orange-800">
//                   <strong>SLA Alert:</strong> Response time due in 45 minutes
//                 </span>
//               </div>
//               <button 
//                 onClick={() => setShowSlaWarning(false)}
//                 className="text-orange-600 hover:text-orange-800"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
//         {/* Back button */}
//         <button 
//           onClick={() => navigate('/agent/tickets')} 
//           className="inline-flex items-center text-gray-600 hover:text-purple-600 mb-6 transition-colors"
//         >
//           <ArrowLeft size={18} className="mr-2" />
//           Back to Queue
//         </button>

//         {/* Main Grid */}
//         <div className="grid lg:grid-cols-3 gap-8">
          
//           {/* Left Column: Ticket Content */}
//           <div className="lg:col-span-2 space-y-6">
            
//             {/* Ticket Header */}
//             <div className="bg-white rounded-xl border border-gray-200 p-6">
//               <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                
//                 {/* Title and ID */}
//                 <div>
//                   <div className="flex items-center gap-3 mb-3">
//                     <h1 className="text-2xl font-bold text-gray-900">{ticket.subject}</h1>
//                     <span className="text-sm text-gray-500">#{ticket.id}</span>
//                   </div>
                  
//                   <div className="flex flex-wrap items-center gap-3">
//                     <StatusBadge status={ticket.status} />
//                     <PriorityBadge priority={ticket.priority} />
//                     <span className="flex items-center text-sm text-gray-500">
//                       <Calendar size={14} className="mr-1" />
//                       Created {new Date(ticket.created).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Actions Dropdown */}
//                 <div className="flex items-center gap-2">
//                   <button 
//                     onClick={() => {
//                       console.log('Mark as resolved');
//                     }}
//                     className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center text-sm"
//                   >
//                     <CheckCircle size={16} className="mr-2" />
//                     Mark Resolved
//                   </button>
//                   <div className="relative">
//                     <button 
//                       onClick={() => {
//                         setShowMoreActions(!showMoreActions);
//                         closeAllDropdowns();
//                       }}
//                       className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                       <MoreVertical size={18} className="text-gray-600" />
//                     </button>
                    
//                     {/* More actions dropdown */}
//                     {showMoreActions && (
//                       <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
//                         <button 
//                           onClick={() => {
//                             console.log('Edit Ticket');
//                             setShowMoreActions(false);
//                           }}
//                           className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
//                         >
//                           <Edit size={14} className="mr-2" />
//                           Edit Ticket
//                         </button>
//                         <button 
//                           onClick={() => {
//                             console.log('Duplicate');
//                             setShowMoreActions(false);
//                           }}
//                           className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
//                         >
//                           <Copy size={14} className="mr-2" />
//                           Duplicate
//                         </button>
//                         <button 
//                           onClick={() => {
//                             console.log('Archive');
//                             setShowMoreActions(false);
//                           }}
//                           className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
//                         >
//                           <Archive size={14} className="mr-2" />
//                           Archive
//                         </button>
//                         <div className="border-t border-gray-100 my-2"></div>
//                         <button 
//                           onClick={() => {
//                             console.log('Delete Ticket');
//                             setShowMoreActions(false);
//                           }}
//                           className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
//                         >
//                           <Trash2 size={14} className="mr-2" />
//                           Delete Ticket
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Description */}
//               <div className="mt-6 pt-6 border-t border-gray-100">
//                 <h3 className="text-sm font-medium text-gray-700 mb-3">Description</h3>
//                 <p className="text-gray-600">{ticket.description}</p>
//               </div>

//               {/* Attachments */}
//               {ticket.attachments.length > 0 && (
//                 <div className="mt-6 pt-6 border-t border-gray-100">
//                   <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
//                     <Paperclip size={16} className="mr-2" />
//                     Attachments
//                   </h3>
//                   <div className="flex flex-wrap gap-3">
//                     {ticket.attachments.map((file, index) => (
//                       <div 
//                         key={index}
//                         className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer group"
//                       >
//                         <div className="p-2 bg-white rounded-lg mr-3">
//                           {file.type === 'pdf' ? (
//                             <FileText size={16} className="text-red-500" />
//                           ) : (
//                             <ImageIcon size={16} className="text-blue-500" />
//                           )}
//                         </div>
//                         <div>
//                           <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
//                             {file.name}
//                           </p>
//                           <p className="text-xs text-gray-500">{file.size}</p>
//                         </div>
//                         <Download size={16} className="ml-4 text-gray-400 group-hover:text-purple-500" />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Tabs: Conversation / Internal Notes */}
//             <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//               <div className="border-b border-gray-200">
//                 <div className="flex">
//                   <button
//                     onClick={() => setActiveTab('conversation')}
//                     className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
//                       activeTab === 'conversation'
//                         ? 'border-purple-600 text-purple-600'
//                         : 'border-transparent text-gray-500 hover:text-gray-700'
//                     }`}
//                   >
//                     <MessageSquare size={16} className="inline mr-2" />
//                     Conversation
//                   </button>
//                   <button
//                     onClick={() => setActiveTab('internal')}
//                     className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
//                       activeTab === 'internal'
//                         ? 'border-purple-600 text-purple-600'
//                         : 'border-transparent text-gray-500 hover:text-gray-700'
//                     }`}
//                   >
//                     <FileText size={16} className="inline mr-2" />
//                     Internal Notes
//                     <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
//                       1
//                     </span>
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6">
//                 {activeTab === 'conversation' ? (
//                   <>
//                     {/* Messages */}
//                     <div className="space-y-6 mb-6">
//                       {messages.filter(m => !m.isInternal).map((msg) => (
//                         <div
//                           key={msg.id}
//                           className={`flex ${msg.isCustomer ? 'justify-start' : 'justify-end'}`}
//                         >
//                           <div className={`flex max-w-3xl ${msg.isCustomer ? '' : 'flex-row-reverse'}`}>
                            
//                             {/* Avatar */}
//                             <div className={`flex-shrink-0 ${msg.isCustomer ? 'mr-4' : 'ml-4'}`}>
//                               <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${
//                                 msg.isCustomer 
//                                   ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
//                                   : 'bg-gradient-to-r from-purple-500 to-indigo-500'
//                               }`}>
//                                 {msg.avatar}
//                               </div>
//                             </div>

//                             {/* Message Content */}
//                             <div className={`flex-1 ${msg.isCustomer ? '' : 'items-end'}`}>
//                               <div className={`flex items-center mb-1 ${msg.isCustomer ? '' : 'flex-row-reverse'}`}>
//                                 <span className="text-sm font-medium text-gray-900">
//                                   {msg.author}
//                                 </span>
//                                 <span className="text-xs text-gray-500 mx-2">
//                                   {msg.timestamp}
//                                 </span>
//                                 {!msg.isCustomer && (
//                                   <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
//                                     Agent
//                                   </span>
//                                 )}
//                               </div>
                              
//                               <div className={`rounded-2xl p-4 ${
//                                 msg.isCustomer
//                                   ? 'bg-gray-100 text-gray-900'
//                                   : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
//                               }`}>
//                                 <p className="text-sm leading-relaxed">
//                                   {msg.message}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Reply Box */}
//                     <form onSubmit={handleSendMessage} className="border-t border-gray-100 pt-6">
//                       <div className="flex items-end space-x-4">
//                         <div className="flex-1">
//                           <textarea
//                             value={newMessage}
//                             onChange={(e) => setNewMessage(e.target.value)}
//                             placeholder="Type your reply... Use @ to mention agents"
//                             rows={3}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none resize-none"
//                           />
                          
//                           <div className="flex items-center justify-between mt-3">
//                             <div className="flex items-center space-x-4">
//                               <button
//                                 type="button"
//                                 className="flex items-center text-sm text-gray-600 hover:text-purple-600 transition-colors"
//                               >
//                                 <Paperclip size={16} className="mr-1" />
//                                 Attach
//                               </button>
//                               <button
//                                 type="button"
//                                 className="flex items-center text-sm text-gray-600 hover:text-purple-600 transition-colors"
//                               >
//                                 <Tag size={16} className="mr-1" />
//                                 Canned Response
//                               </button>
//                             </div>
                            
//                             <button
//                               type="submit"
//                               disabled={!newMessage.trim()}
//                               className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-purple-200 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                               <Send size={16} className="mr-2" />
//                               Send Reply
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </form>
//                   </>
//                 ) : (
//                   <>
//                     {/* Internal Notes */}
//                     <div className="space-y-4 mb-6">
//                       {messages.filter(m => m.isInternal).map((note) => (
//                         <div key={note.id} className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
//                           <div className="flex items-start">
//                             <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-medium mr-3">
//                               {note.avatar}
//                             </div>
//                             <div className="flex-1">
//                               <div className="flex items-center justify-between mb-2">
//                                 <div className="flex items-center">
//                                   <span className="text-sm font-medium text-gray-900">{note.author}</span>
//                                   <span className="text-xs text-gray-500 ml-2">{note.timestamp}</span>
//                                 </div>
//                                 <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
//                                   Internal Note
//                                 </span>
//                               </div>
//                               <p className="text-sm text-gray-700">{note.message}</p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Add Internal Note */}
//                     {showInternalNote ? (
//                       <form onSubmit={handleSendInternalNote} className="border-t border-gray-100 pt-6">
//                         <h4 className="text-sm font-medium text-gray-700 mb-3">Add Internal Note</h4>
//                         <textarea
//                           value={internalNote}
//                           onChange={(e) => setInternalNote(e.target.value)}
//                           placeholder="Type your internal note... Only visible to agents"
//                           rows={3}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none resize-none"
//                         />
//                         <div className="flex items-center justify-end gap-3 mt-3">
//                           <button
//                             type="button"
//                             onClick={() => setShowInternalNote(false)}
//                             className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//                           >
//                             Cancel
//                           </button>
//                           <button
//                             type="submit"
//                             disabled={!internalNote.trim()}
//                             className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center disabled:opacity-50"
//                           >
//                             <FileText size={16} className="mr-2" />
//                             Save Note
//                           </button>
//                         </div>
//                       </form>
//                     ) : (
//                       <button
//                         onClick={() => setShowInternalNote(true)}
//                         className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors flex items-center justify-center"
//                       >
//                         <FileText size={16} className="mr-2" />
//                         Add Internal Note
//                       </button>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right Column: Customer & Ticket Info */}
//           <div className="space-y-6">
            
//             {/* Customer Profile Card */}
//             <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-bold text-gray-900">Customer</h3>
//                   <button 
//                     onClick={() => navigate(`/agent/customers/${ticket.customer.email}`)}
//                     className="text-purple-600 hover:text-purple-700 text-sm font-medium"
//                   >
//                     View Profile
//                   </button>
//                 </div>
                
//                 <div className="flex items-center mb-4">
//                   <div className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl mr-4">
//                     {ticket.customer.avatar}
//                   </div>
//                   <div>
//                     <p className="font-bold text-gray-900">{ticket.customer.name}</p>
//                     <p className="text-sm text-gray-600">{ticket.customer.company}</p>
//                     <div className="flex items-center mt-1">
//                       <Star size={14} className="text-yellow-400 fill-current" />
//                       <span className="text-xs text-gray-600 ml-1">{ticket.customer.satisfaction}% satisfaction</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-3 border-t border-gray-100 pt-4">
//                   <div className="flex items-center text-sm">
//                     <Mail size={14} className="text-gray-400 mr-3" />
//                     <a href={`mailto:${ticket.customer.email}`} className="text-gray-600 hover:text-purple-600">
//                       {ticket.customer.email}
//                     </a>
//                   </div>
//                   <div className="flex items-center text-sm">
//                     <Phone size={14} className="text-gray-400 mr-3" />
//                     <a href={`tel:${ticket.customer.phone}`} className="text-gray-600 hover:text-purple-600">
//                       {ticket.customer.phone}
//                     </a>
//                   </div>
//                   <div className="flex items-center text-sm">
//                     <Calendar size={14} className="text-gray-400 mr-3" />
//                     <span className="text-gray-600">Customer since {ticket.customer.memberSince}</span>
//                   </div>
//                   <div className="flex items-center text-sm">
//                     <Ticket size={14} className="text-gray-400 mr-3" />
//                     <span className="text-gray-600">{ticket.customer.totalTickets} total tickets</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Assignment & Status Card */}
//             <div className="bg-white rounded-xl border border-gray-200 p-6">
//               <h3 className="text-lg font-bold text-gray-900 mb-4">Ticket Management</h3>
              
//               {/* Assigned Agent */}
//               <div className="mb-4">
//                 <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Assigned To</label>
//                 <div className="relative">
//                   <button
//                     onClick={() => {
//                       setShowAssignDropdown(!showAssignDropdown);
//                       setShowStatusDropdown(false);
//                       setShowPriorityDropdown(false);
//                       setShowMoreActions(false);
//                     }}
//                     className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//                   >
//                     <div className="flex items-center">
//                       <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-medium mr-2">
//                         {ticket.assignedTo.avatar}
//                       </div>
//                       <div className="text-left">
//                         <p className="text-sm font-medium text-gray-900">{ticket.assignedTo.name}</p>
//                         <p className="text-xs text-gray-500">{ticket.assignedTo.role}</p>
//                       </div>
//                     </div>
//                     <ChevronDown size={16} className="text-gray-500" />
//                   </button>
                  
//                   {showAssignDropdown && (
//                     <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
//                       <button 
//                         onClick={() => {
//                           console.log('Assign to me');
//                           setShowAssignDropdown(false);
//                         }}
//                         className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
//                       >
//                         <UserPlus size={14} className="mr-2" />
//                         Assign to me
//                       </button>
//                       <button 
//                         onClick={() => {
//                           console.log('Reassign');
//                           setShowAssignDropdown(false);
//                         }}
//                         className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
//                       >
//                         <Users size={14} className="mr-2" />
//                         Reassign...
//                       </button>
//                       <button 
//                         onClick={() => {
//                           console.log('Unassign');
//                           setShowAssignDropdown(false);
//                         }}
//                         className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
//                       >
//                         <X size={14} className="mr-2" />
//                         Unassign
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Status & Priority */}
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Status</label>
//                   <div className="relative">
//                     <button
//                       onClick={() => {
//                         setShowStatusDropdown(!showStatusDropdown);
//                         setShowAssignDropdown(false);
//                         setShowPriorityDropdown(false);
//                         setShowMoreActions(false);
//                       }}
//                       className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//                     >
//                       <StatusBadge status={ticket.status} />
//                       <ChevronDown size={16} className="text-gray-500" />
//                     </button>
                    
//                     {showStatusDropdown && (
//                       <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
//                         {['open', 'in-progress', 'resolved', 'closed'].map((status) => (
//                           <button
//                             key={status}
//                             onClick={() => {
//                               console.log('Change status to:', status);
//                               setShowStatusDropdown(false);
//                             }}
//                             className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                           >
//                             {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Priority</label>
//                   <div className="relative">
//                     <button
//                       onClick={() => {
//                         setShowPriorityDropdown(!showPriorityDropdown);
//                         setShowAssignDropdown(false);
//                         setShowStatusDropdown(false);
//                         setShowMoreActions(false);
//                       }}
//                       className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//                     >
//                       <PriorityBadge priority={ticket.priority} />
//                       <ChevronDown size={16} className="text-gray-500" />
//                     </button>
                    
//                     {showPriorityDropdown && (
//                       <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
//                         {['urgent', 'high', 'medium', 'low'].map((priority) => (
//                           <button
//                             key={priority}
//                             onClick={() => {
//                               console.log('Change priority to:', priority);
//                               setShowPriorityDropdown(false);
//                             }}
//                             className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                           >
//                             {priority.charAt(0).toUpperCase() + priority.slice(1)}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Tags */}
//               <div>
//                 <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Tags</label>
//                 <div className="flex flex-wrap gap-2">
//                   {ticket.tags.map((tag, i) => (
//                     <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs flex items-center">
//                       {tag}
//                       <button 
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           console.log('Remove tag:', tag);
//                         }}
//                         className="ml-1 hover:text-gray-900"
//                       >
//                         <X size={12} />
//                       </button>
//                     </span>
//                   ))}
//                   <button 
//                     onClick={() => console.log('Add tag')}
//                     className="px-3 py-1.5 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-colors"
//                   >
//                     + Add tag
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* SLA Card */}
//             <div className="bg-white rounded-xl border border-gray-200 p-6">
//               <h3 className="text-lg font-bold text-gray-900 mb-4">SLA Status</h3>
//               <div className="space-y-4">
//                 <div>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="text-gray-600">Response Time</span>
//                     <span className="font-medium text-green-600">{ticket.sla.response}</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
//                   </div>
//                 </div>
//                 <div>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="text-gray-600">Resolution Time</span>
//                     <span className="font-medium text-yellow-600">{ticket.sla.resolution}</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Suggested Articles */}
//             <div className="bg-white rounded-xl border border-gray-200 p-6">
//               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
//                 <FileText size={18} className="mr-2 text-purple-600" />
//                 Suggested Articles
//               </h3>
//               <div className="space-y-3">
//                 {suggestedArticles.map((article, i) => (
//                   <a 
//                     key={i}
//                     href={article.url}
//                     className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       console.log('Open article:', article.title);
//                     }}
//                   >
//                     <p className="text-sm font-medium text-gray-900 hover:text-purple-600">
//                       {article.title}
//                     </p>
//                   </a>
//                 ))}
//               </div>
//             </div>

//             {/* Customer History */}
//             <div className="bg-white rounded-xl border border-gray-200 p-6">
//               <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Tickets</h3>
//               <div className="space-y-3">
//                 {customerHistory.map((history) => (
//                   <div 
//                     key={history.id} 
//                     className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
//                     onClick={() => navigate(`/agent/tickets/${history.id}`)}
//                   >
//                     <div>
//                       <p className="text-sm font-medium text-gray-900">{history.id}</p>
//                       <p className="text-xs text-gray-500">{history.subject}</p>
//                     </div>
//                     <span className="text-xs text-gray-500">{history.date}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AgentTicketDetailPage;