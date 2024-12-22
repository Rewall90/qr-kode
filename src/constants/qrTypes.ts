import { Link, Mail, Phone, MessageSquare, Wifi, Youtube, Instagram, Music, Facebook, MessageCircle, Twitter, MapPin } from 'lucide-react';
import { QRType } from '../types/qr';
import { translations as t } from './translations';

export const qrTypes: QRType[] = [
  { icon: Link, label: t.url, placeholder: t.enterUrl },
  { icon: Mail, label: t.email, placeholder: t.enterEmail },
  { icon: Phone, label: t.phone, placeholder: t.enterPhone },
  { icon: MessageSquare, label: t.sms, placeholder: t.enterMessage },
  { icon: MessageCircle, label: t.text, placeholder: t.enterText },
  { icon: Wifi, label: t.wifi, placeholder: t.enterWifiName },
  { icon: MapPin, label: t.location, placeholder: t.enterLocation },
  { icon: Instagram, label: t.instagram, placeholder: t.enterUsername },
  { icon: Youtube, label: t.youtube, placeholder: t.enterVideoUrl },
  { icon: Music, label: t.tiktok, placeholder: t.enterUsername },
  { icon: Facebook, label: t.facebook, placeholder: t.enterUsername },
  { icon: MessageCircle, label: t.whatsapp, placeholder: t.enterPhone },
  { icon: Twitter, label: t.twitter, placeholder: t.enterUsername },
];