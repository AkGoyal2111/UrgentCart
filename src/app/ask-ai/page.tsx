'use client';

import { useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { ChatMessageList } from '@/components/chat/ChatMessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { SuggestionChips } from '@/components/chat/SuggestionChips';
import { useConversationStore } from '@/stores/conversationStore';
import { useCartStore } from '@/stores/cartStore';
import { generateCart, modifyCart } from '@/services/aiService';
import { trackEvent } from '@/services/analytics';

// Keywords that indicate the user is describing a new situation rather than modifying the current cart
const SITUATION_KEYWORDS = [
  'fever', 'cold', 'sick', 'headache', 'flu',
  'movie night', 'movie', 'guests', 'arriving', 'party', 'house party',
  'exam', 'study', 'all-nighter',
  'weekend trip', 'trip', 'travel', 'picnic', 'camping',
  'breakfast', 'lunch', 'dinner', 'cook',
  'baby', 'diaper',
  'power cut', 'blackout',
  'rain', 'monsoon',
  'work from home', 'office',
  'gym', 'workout',
  'spa', 'relax',
  'birthday', 'anniversary', 'diwali',
  'hungry', 'craving',
  'new apartment', 'moving',
  'emergency',
  'i have', 'i need', 'i am', "i'm",
];

/**
 * Detects if the user's message describes a completely new situation
 * rather than a modification to the existing cart.
 */
function detectNewSituation(message: string): boolean {
  const lower = message.toLowerCase();

  // Modification keywords — if these are present, it's a modify request
  const modifyKeywords = [
    'add more', 'remove', 'replace', 'swap', 'change', 'make it',
    'budget', 'cheaper', 'vegetarian', 'veg only', 'no non-veg',
    'for kids', 'add dessert', 'add snack', 'more snack',
    'no alcohol', 'no soft drink', 'no cola',
    'increase', 'decrease', 'quantity',
  ];

  for (const mod of modifyKeywords) {
    if (lower.includes(mod)) return false;
  }

  // Check if message matches a situation keyword
  for (const keyword of SITUATION_KEYWORDS) {
    if (lower.includes(keyword)) return true;
  }

  return false;
}

export default function AskAIPage() {
  const messages = useConversationStore((state) => state.messages);
  const isAITyping = useConversationStore((state) => state.isAITyping);
  const suggestions = useConversationStore((state) => state.suggestions);
  const initialSuggestions = useConversationStore((state) => state.initialSuggestions);
  const addUserMessage = useConversationStore((state) => state.addUserMessage);
  const addAIResponse = useConversationStore((state) => state.addAIResponse);
  const setAITyping = useConversationStore((state) => state.setAITyping);
  const updateSuggestionsFromCart = useConversationStore((state) => state.updateSuggestionsFromCart);
  const clearConversation = useConversationStore((state) => state.clearConversation);

  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const hasCart = cartItems.length > 0;

  const handleSend = useCallback(
    async (text: string) => {
      // Strip emoji prefix if it came from initial suggestions
      const cleanText = text.replace(/^[^\w\s]+\s*/, '').trim() || text;
      
      addUserMessage(text);
      setAITyping(true);

      try {
        // Detect if the user is describing a new situation (not a modification)
        const isNewSituation = detectNewSituation(cleanText);

        if (!hasCart || isNewSituation) {
          // Generate a cart suggestion (don't add to cart yet — user decides)
          trackEvent('situation_submitted', { situation: cleanText, source: 'ask-ai' });
          const result = await generateCart(cleanText);
          trackEvent('cart_generated', {
            situationLabel: result.situationLabel,
            itemCount: result.items.length,
            total: result.estimatedCost,
          });
          addAIResponse(result.reply, result.items, {
            cartName: result.cartName,
            reasoning: result.reasoning,
            categories: result.categories,
            estimatedCost: result.estimatedCost,
            estimatedDelivery: result.estimatedDelivery,
          });
          updateSuggestionsFromCart(result.items);
        } else {
          // Subsequent messages: modify cart
          const result = await modifyCart(cartItems, cleanText);

          // Apply diff
          for (const id of result.cartDiff.remove) {
            removeItem(id);
          }
          for (const item of result.cartDiff.add) {
            addItem(item);
          }

          // Get updated cart for preview
          const updatedItems = [
            ...cartItems.filter((i) => !result.cartDiff.remove.includes(i.id)),
            ...result.cartDiff.add,
          ];

          trackEvent('cart_modified', {
            action: cleanText,
            itemsAdded: result.cartDiff.add.length,
            itemsRemoved: result.cartDiff.remove.length,
          });

          addAIResponse(result.reply, updatedItems);
          updateSuggestionsFromCart(updatedItems);
        }
      } catch {
        addAIResponse("Oops, something went wrong. Please try again! 😅");
      } finally {
        setAITyping(false);
      }
    },
    [hasCart, cartItems, addUserMessage, setAITyping, clearCart, addAIResponse, addItem, removeItem, updateSuggestionsFromCart]
  );

  // Show initial suggestions when no cart, show contextual suggestions when cart exists
  const showInitialSuggestions = !hasCart && messages.length === 0 && !isAITyping;
  const showCartSuggestions = hasCart && !isAITyping;

  function handleClearCart() {
    clearCart();
    clearConversation();
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] bg-[#eaeded]">
      {/* Top bar with clear cart */}
      {hasCart && (
        <div className="flex justify-between items-center px-4 py-2 bg-white border-b border-[#d5d9d9]">
          <span className="text-xs text-[#565959]">{cartItems.length} items in cart</span>
          <button
            onClick={handleClearCart}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#cc0c39] border border-[#cc0c39]/30 bg-white hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear Cart & Start Fresh
          </button>
        </div>
      )}
      <ChatMessageList messages={messages} isAITyping={isAITyping} />
      <SuggestionChips
        suggestions={showInitialSuggestions ? initialSuggestions : suggestions}
        onSelect={handleSend}
        show={showInitialSuggestions || showCartSuggestions}
      />
      <ChatInput onSend={handleSend} disabled={isAITyping} />
    </div>
  );
}
