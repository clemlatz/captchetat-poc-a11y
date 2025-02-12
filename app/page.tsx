"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Play, Pause, RefreshCw, Lightbulb } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
  captcha: z.string().min(1, {
    message: "Veuillez entrer le code captcha.",
  }),
});

export default function Home() {
  const [captchaMode, setCaptchaMode] = useState<"image" | "question">("image");
  const [captchaImageIndex, setCaptchaImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const captchaImages = [
    "/captcha-example-0.png",
    "/captcha-example-1.png",
    "/captcha-example-2.png",
    "/captcha-example-3.png",
    "/captcha-example-4.png",
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      captcha: "",
    },
  });

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = "/captcha-example.mp3";
    }
  }, []);

  const handleAudioToggle = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const refreshCaptcha = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * captchaImages.length);
    } while (newIndex === captchaImageIndex);
    setCaptchaImageIndex(newIndex);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const correctAnswer = captchaMode === "image" ? "4J4BRC" : "PRINTEMPS";
    if (values.captcha.toUpperCase() !== correctAnswer) {
      form.setError("captcha", {
        message: "Le code captcha est incorrect.",
      });
      return;
    }
    alert("Formulaire soumis avec succès!");
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[526px] bg-white p-8 rounded-lg shadow-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="fr-py-5w space-y-6"
          >
            <h1 className="fr-h1 text-2xl font-bold mb-6">Inscription</h1>

            <div className="fr-fieldset__element mb-6">
              <p className="fr-text--sm text-sm text-gray-600">
                Les champs suivis d&apos;un astérisque (*) sont obligatoires.
              </p>
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="fr-fieldset__element">
                  <FormLabel className="fr-label flex items-center gap-1">
                    Adresse électronique <span className="text-primary">*</span>
                  </FormLabel>
                  <p className="fr-hint-text text-sm text-gray-500">
                    Format attendu : adresse@mail.com
                  </p>
                  <FormControl>
                    <Input
                      placeholder="adresse@mail.com"
                      type="email"
                      className="fr-input"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="fr-fieldset__element">
                  <FormLabel className="fr-label flex items-center gap-1">
                    Mot de passe <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="fr-input"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="captcha"
              render={({ field }) => (
                <FormItem className="fr-fieldset__element">
                  <FormLabel className="fr-label flex items-center gap-1">
                    {captchaMode === "image"
                      ? "Reproduire la suite de caractères du captcha"
                      : "Quelle est la saison du mois d'avril en Allemagne ?"}{" "}
                    <span className="text-primary">*</span>
                  </FormLabel>

                  {captchaMode === "image" && (
                    <div className="space-y-3">
                      <div className="flex items-end gap-2">
                        <Image
                          src={captchaImages[captchaImageIndex]}
                          alt="Exemple de CAPTCHA"
                          className="h-12"
                          width={209}
                          height={77}
                        />
                        <audio ref={audioRef} loop />

                        <div className="flex gap-2">
                          <button
                            type="button"
                            // variant="outline"
                            // size="icon"
                            onClick={handleAudioToggle}
                            aria-label={
                              isPlaying
                                ? "Mettre en pause la lecture"
                                : "Lire le code du captcha"
                            }
                            className="border-none"
                          >
                            {isPlaying ? (
                              <Image
                                src="/icons/pause.svg"
                                alt="Pause"
                                width={25}
                                height={25}
                              />
                            ) : (
                              <Image
                                src="/icons/play.svg"
                                alt="Play"
                                width={25}
                                height={25}
                              />
                            )}
                          </button>

                          <button
                            type="button"
                            // variant="outline"
                            // size="icon"
                            onClick={refreshCaptcha}
                            aria-label="Générer un nouveau captcha"
                            className="border-none"
                          >
                            <Image
                              src="/icons/refresh.svg"
                              alt="Refresh"
                              width={25}
                              height={25}
                            />
                          </button>

                          <button
                            type="button"
                            // variant="outline"
                            // size="icon"
                            onClick={() => setCaptchaMode("question")}
                            aria-label="Afficher un captcha simplifié"
                            className="border-none"
                          >
                            <Image
                              src="/icons/simplify.svg"
                              alt="Simplify"
                              width={25}
                              height={25}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <FormControl>
                    <Input
                      {...field}
                      className="fr-input"
                      style={{
                        textTransform:
                          captchaMode === "image" ? "uppercase" : "none",
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="fr-btns-group">
              <Button
                type="submit"
                className="fr-btn w-full bg-[#000091] hover:bg-[#000074]"
              >
                Créer mon compte
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
