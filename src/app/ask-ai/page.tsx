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
  const setCartFromAI = useCartStore((state) => state.setCartFromAI);
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
          // Generate a fresh cart (either first message or a completely new situation)
          if (hasCart && isNewSituation) {
            clearCart();
          }
          trackEvent('situation_submitted', { situation: cleanText, source: 'ask-ai' });
          const result = await generateCart(cleanText);
          setCartFromAI(result.items, result.situationLabel);
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
          // Update suggestions based on generated cart
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
          // Update suggestions based on new cart state
          updateSuggestionsFromCart(updatedItems);
        }
      } catch {
        addAIResponse("Oops, something went wrong. Please try again! 😅");
      } finally {
        setAITyping(false);
      }
    },
    [hasCart, cartItems, addUserMessage, setAITyping, setCartFromAI, clearCart, addAIResponse, addItem, removeItem, updateSuggestionsFromCart]
  );

  // Show initial suggestions when no cart, show contextual suggestions when cart exists
  const showInitialSuggestions = !hasCart && messages.length === 0 && !isAITyping;
  const showCartSuggestions = hasCart && !isAITyping;

  function handleClearCart() {
    clearCart();
    clearConversation();
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)]">
      {/* Clear Cart button when cart has items */}
      {hasCart && (
        <div className="flex justify-end px-4 py-2 border-b border-gray-100">
          <button
            onClick={handleClearCart}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear Cart
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
