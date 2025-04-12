// store/index.js
export const state = () => ({
    bookings: []
  });
  
  export const mutations = {
    addBooking(state, booking) {
      state.bookings.push(booking);
    }
  };
  
  export const actions = {
    reserveSlot({ commit }, slot) {
      commit('addBooking', slot);
    }
  };
  