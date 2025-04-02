import { create } from 'zustand';

const useStore = create((set) => ({
  text: null, // Initial string value
  setText: (newText) => set({ text: newText }) // Function to update text
}));

export default useStore;
