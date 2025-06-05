
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, X } from "lucide-react";

const FloatingRating = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRating = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating > 0) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSubmitted(false);
        setRating(0);
      }, 2000);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-[#EC0444] hover:bg-[#EC0444]/90 text-white rounded-full p-4 shadow-lg"
          size="lg"
        >
          <Star className="h-5 w-5 mr-2" />
          Avaliar plataforma
        </Button>
      </div>

      {/* Rating Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 mx-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Avaliar Plataforma</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {!isSubmitted ? (
                <div className="space-y-6">
                  <p className="text-center text-muted-foreground">
                    Como você avalia nossa plataforma?
                  </p>
                  
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-colors"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= (hoveredRating || rating)
                              ? 'text-[#EC0444] fill-[#EC0444]'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={rating === 0}
                      className="bg-[#EC0444] hover:bg-[#EC0444]/90"
                    >
                      Enviar Avaliação
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Star className="h-8 w-8 text-green-600 fill-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Obrigado!</h3>
                  <p className="text-muted-foreground">
                    Sua avaliação foi enviada com sucesso.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default FloatingRating;
