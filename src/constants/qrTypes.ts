import { Link, Mail, Phone, MessageSquare, Wifi, Youtube, Instagram, Music, Facebook, MessageCircle, Twitter, MapPin } from 'lucide-react';
import { QRType } from '../types/qr';

export const qrTypes: QRType[] = [
  { icon: Link, label: 'NETTSIDE', placeholder: 'Skriv inn nettadresse' },
  { icon: Mail, label: 'E-POST', placeholder: 'navn@eksempel.no' },
  { icon: Phone, label: 'TELEFON', placeholder: 'Telefonnummer' },
  { icon: MessageSquare, label: 'SMS', placeholder: 'Skriv melding her...' },
  { icon: MessageCircle, label: 'TEKST', placeholder: 'Skriv tekst her' },
  { icon: Wifi, label: 'WIFI', placeholder: 'Skriv navn på nettverk' },
  { icon: MapPin, label: 'GEOLOKASJON', placeholder: 'Skriv inn adresse eller koordinater' },
  { icon: Instagram, label: 'INSTAGRAM', placeholder: '@brukernavn' },
  { icon: Youtube, label: 'YOUTUBE', placeholder: 'Video URL' },
  { icon: Music, label: 'TIKTOK', placeholder: '@brukernavn' },
  { icon: Facebook, label: 'FACEBOOK', placeholder: '@brukernavn' },
  { icon: MessageCircle, label: 'WHATSAPP', placeholder: 'Telefonnummer' },
  { icon: Twitter, label: 'TWITTER', placeholder: '@brukernavn' },
];