import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {  Ticket, CreateTicketData, UpdateTicketData, TicketMessage } from './ticketsApi';
import { ticketsAPI } from './ticketsApi';
import type { RootState } from '../../store';

export interface TicketsState {
  tickets: Ticket[];
  currentTicket: Ticket | null;
  messages: TicketMessage[];
  filters: {
    status: string | null;
    priority: string | null;
    search: string;
  };
  stats: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    urgent: number;
  } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TicketsState = {
  tickets: [],
  currentTicket: null,
  messages: [],
  filters: {
    status: null,
    priority: null,
    search: '',
  },
  stats: null,
  isLoading: false,
  error: null,
};

// Helper function to handle errors
const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return 'An unknown error occurred';
  }
};

// ==================== ASYNC THUNKS ====================

// Fetch all tickets
export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (
    filters: { status?: string; priority?: string } = {},
    thunkAPI
  ) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const tickets = await ticketsAPI.fetchTickets(filters);
      return tickets;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const fetchUserTickets = createAsyncThunk(
  'tickets/fetchUserTickets',
  async (userId: string, { rejectWithValue }) => {
    try {      const tickets = await ticketsAPI.fetchUserTickets(userId);
      return tickets;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const selectUserTickets = (state: RootState, userId: string) => {
  return state.tickets.tickets.filter(ticket => ticket.customer_id === userId);
};

// Fetch a single ticket by ID
export const fetchTicketById = createAsyncThunk(
  'tickets/fetchTicketById',
  async (ticketId: string, { rejectWithValue }) => {
    try {
      const ticket = await ticketsAPI.fetchTicketById(ticketId);
      return ticket;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Create a new ticket
export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async ({ ticketData, userId }: { ticketData: CreateTicketData; userId: string }, { rejectWithValue }) => {
    try {
      const ticket = await ticketsAPI.createTicket(ticketData, userId);
      return ticket;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Update a ticket
export const updateTicket = createAsyncThunk(
  'tickets/updateTicket',
  async ({ ticketId, updates }: { ticketId: string; updates: UpdateTicketData }, { rejectWithValue }) => {
    try {
      const ticket = await ticketsAPI.updateTicket(ticketId, updates);
      return ticket;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Delete a ticket
export const deleteTicket = createAsyncThunk(
  'tickets/deleteTicket',
  async (ticketId: string, { rejectWithValue }) => {
    try {
      await ticketsAPI.deleteTicket(ticketId);
      return ticketId;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Fetch messages for a ticket
export const fetchMessages = createAsyncThunk(
  'tickets/fetchMessages',
  async (ticketId: string, { rejectWithValue }) => {
    try {
      const messages = await ticketsAPI.fetchMessages(ticketId);
      return messages;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Add a message to a ticket
export const addMessage = createAsyncThunk(
  'tickets/addMessage',
  async (
    { 
      ticketId, 
      message, 
      authorId, 
      authorName, 
      authorAvatar,
      isInternal 
    }: { 
      ticketId: string; 
      message: string; 
      authorId: string; 
      authorName: string; 
      authorAvatar?: string;
      isInternal?: boolean;
    }, 
    { rejectWithValue }
  ) => {
    try {
      const newMessage = await ticketsAPI.addMessage(
        ticketId, 
        message, 
        authorId, 
        authorName, 
        authorAvatar,
        isInternal || false
      );
      return newMessage;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Get user ticket stats
export const getUserTicketStats = createAsyncThunk(
  'tickets/getUserTicketStats',
  async (userId: string, { rejectWithValue }) => {
    try {
      const stats = await ticketsAPI.getUserTicketStats(userId);
      return stats;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Get agent ticket stats
export const getAgentTicketStats = createAsyncThunk(
  'tickets/getAgentTicketStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await ticketsAPI.getAgentTicketStats();
      return stats;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// ==================== SLICE ====================

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set filters
    setStatusFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.status = action.payload;
    },
    setPriorityFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.priority = action.payload;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        status: null,
        priority: null,
        search: '',
      };
    },

    // Clear current ticket
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
      state.messages = [];
    },

    // Clear all state (for logout)
    clearTicketsState: () => initialState,
  },
  extraReducers: (builder) => {
    // ========== FETCH TICKETS ==========
    builder.addCase(fetchTickets.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTickets.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tickets = action.payload;
    });
    builder.addCase(fetchTickets.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // ========== FETCH TICKET BY ID ==========
    builder.addCase(fetchTicketById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTicketById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentTicket = action.payload;
    });
    builder.addCase(fetchTicketById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // ========== CREATE TICKET ==========
    builder.addCase(createTicket.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createTicket.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tickets = [action.payload, ...state.tickets];
    });
    builder.addCase(createTicket.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // ========== UPDATE TICKET ==========
    builder.addCase(updateTicket.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateTicket.fulfilled, (state, action) => {
      state.isLoading = false;
      
      // Update in tickets list
      const index = state.tickets.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tickets[index] = action.payload;
      }
      
      // Update current ticket if it's the same
      if (state.currentTicket?.id === action.payload.id) {
        state.currentTicket = action.payload;
      }
    });
    builder.addCase(updateTicket.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // ========== DELETE TICKET ==========
    builder.addCase(deleteTicket.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteTicket.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tickets = state.tickets.filter(t => t.id !== action.payload);
      
      if (state.currentTicket?.id === action.payload) {
        state.currentTicket = null;
      }
    });
    builder.addCase(deleteTicket.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // ========== FETCH MESSAGES ==========
    builder.addCase(fetchMessages.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.isLoading = false;
      state.messages = action.payload;
    });
    builder.addCase(fetchMessages.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // ========== ADD MESSAGE ==========
    builder.addCase(addMessage.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addMessage.fulfilled, (state, action) => {
      state.isLoading = false;
      state.messages = [...state.messages, action.payload];
    });
    builder.addCase(addMessage.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // ========== GET USER STATS ==========
    builder.addCase(getUserTicketStats.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUserTicketStats.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stats = action.payload;
    });
    builder.addCase(getUserTicketStats.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // ========== GET AGENT STATS ==========
    builder.addCase(getAgentTicketStats.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getAgentTicketStats.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stats = action.payload;
    });
    builder.addCase(getAgentTicketStats.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

// ==================== SELECTORS ====================

export const selectAllTickets = (state: RootState) => state.tickets.tickets;
export const selectCurrentTicket = (state: RootState) => state.tickets.currentTicket;
export const selectTicketMessages = (state: RootState) => state.tickets.messages;
export const selectTicketsLoading = (state: RootState) => state.tickets.isLoading;
export const selectTicketsError = (state: RootState) => state.tickets.error;
export const selectTicketStats = (state: RootState) => state.tickets.stats;
export const selectTicketFilters = (state: RootState) => state.tickets.filters;

// Filtered tickets selector
export const selectFilteredTickets = (state: RootState) => {
  const { tickets, filters } = state.tickets;
  const { status, priority, search } = filters;

  return tickets.filter(ticket => {
    // Status filter
    if (status && ticket.status !== status) return false;
    
    // Priority filter
    if (priority && ticket.priority !== priority) return false;
    
    // Search filter
    if (search && !ticket.subject.toLowerCase().includes(search.toLowerCase()) &&
        !ticket.description?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
};

export const { 
  clearError, 
  setStatusFilter, 
  setPriorityFilter, 
  setSearchFilter,
  clearFilters,
  clearCurrentTicket,
  clearTicketsState 
} = ticketsSlice.actions;

export default ticketsSlice.reducer;