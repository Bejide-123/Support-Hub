import { supabase } from '../../lib/Supabase';

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  ticket_number: string;
  customer_id: string;
  assigned_to?: string | null;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
  tags?: string[];
  attachments?: {
    name: string;
    size: string;
    url: string;
  }[];
}

export interface CreateTicketData {
  subject: string;
  description: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  ticket_number : string;
}

export interface UpdateTicketData {
  title?: string;
  description?: string;
  status?: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string | null;
  snoozed_until?: string;
  subject?: string;      
  category?: string;     
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  message: string;
  is_internal?: boolean;
  created_at: string;
  attachments?: {
    name: string;
    size: string;
    url: string;
  }[];
}

export const ticketsAPI = {
  // ==================== TICKET OPERATIONS ====================

  // Fetch all tickets (with optional filters)
  fetchTickets: async (filters?: {
    status?: string;
    priority?: string;
    assigned_to?: string;
    customer_id?: string;
  }): Promise<Ticket[]> => {
    let query = supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.assigned_to) {
      query = query.eq('assigned_to', filters.assigned_to);
    }
    if (filters?.customer_id) {
      query = query.eq('customer_id', filters.customer_id);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Ticket[];
  },

  // Fetch a single ticket by ID
  fetchTicketById: async (ticketId: string): Promise<Ticket> => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .single();

    if (error) throw error;
    return data as Ticket;
  },

  fetchUserTickets: async (userId: string): Promise<Ticket[]> => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Ticket[];
  },

   fetchAgentTickets: async (agentId: string): Promise<Ticket[]> => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('assigned_to', agentId)
      .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Ticket[];
  },

   fetchUnassignedTickets: async (): Promise<Ticket[]> => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .is('assigned_to', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Ticket[];
  },

  selectUserTickets: async (userId: string, status?: string): Promise<Ticket[]> => {
    let query = supabase
      .from('tickets')
      .select('*')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }
    const { data, error } = await query;

    if (error) throw error;
    return data as Ticket[];
  },

  fetchAssignedTickets: async (userId: string): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('assigned_to', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Ticket[];
},
  
  // Create a new ticket
  createTicket: async (ticketData: CreateTicketData, userId: string): Promise<Ticket> => {
    const { data, error } = await supabase
      .from('tickets')
      .insert([{
        subject: ticketData.subject,
        description: ticketData.description,
        category: ticketData.category || 'general',
        priority: ticketData.priority || 'medium',
        ticket_number: ticketData.ticket_number,
        status: 'open',
        customer_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data as Ticket;
  },

  // Update a ticket
  updateTicket: async (ticketId: string, updates: UpdateTicketData): Promise<Ticket> => {
    const { data, error } = await supabase
      .from('tickets')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) throw error;
    return data as Ticket;
  },

  // Delete a ticket
  deleteTicket: async (ticketId: string): Promise<void> => {
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', ticketId);

    if (error) throw error;
  },

  // ==================== MESSAGE OPERATIONS ====================

  // Fetch messages for a ticket
  fetchMessages: async (ticketId: string): Promise<TicketMessage[]> => {
    const { data, error } = await supabase
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as TicketMessage[];
  },

  // Add a message to a ticket
  addMessage: async (
    ticketId: string,
    message: string,
    authorId: string,
    authorName: string,
    authorAvatar?: string,
    isInternal: boolean = false
  ): Promise<TicketMessage> => {
    const { data, error } = await supabase
      .from('ticket_messages')
      .insert([{
        ticket_id: ticketId,
        author_id: authorId,
        author_name: authorName,
        author_avatar: authorAvatar,
        message: message,
        is_internal: isInternal,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;

    // Update the ticket's updated_at timestamp
    await supabase
      .from('tickets')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', ticketId);

    return data as TicketMessage;
  },

  // ==================== STATISTICS ====================

  // Get ticket statistics for a user
  getUserTicketStats: async (userId: string): Promise<{
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    urgent: number;
  }> => {
    const { data, error } = await supabase
      .from('tickets')
      .select('status, priority')
      .eq('customer_id', userId);

    if (error) throw error;

    const stats = {
      total: data.length,
      open: data.filter(t => t.status === 'open').length,
      inProgress: data.filter(t => t.status === 'in-progress').length,
      resolved: data.filter(t => t.status === 'resolved').length,
      urgent: data.filter(t => t.priority === 'urgent').length,
    };

    return stats;
  },

  // Get ticket statistics for agents
  getAgentTicketStats: async (): Promise<{
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    urgent: number;
  }> => {
    const { data, error } = await supabase
      .from('tickets')
      .select('status, priority, assigned_to');

    if (error) throw error;

    const stats = {
      total: data.length,
      open: data.filter(t => t.status === 'open').length,
      inProgress: data.filter(t => t.status === 'in-progress').length,
      resolved: data.filter(t => t.status === 'resolved').length,
      urgent: data.filter(t => t.priority === 'urgent').length,
    };

    return stats;
  },
};