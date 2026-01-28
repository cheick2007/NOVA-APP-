
import { createClient } from '@supabase/supabase-js'

// Récupération de l'URL du projet Supabase depuis les variables d'environnement
// Le '!' indique à TypeScript que nous sommes sûrs que cette variable existe
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

// Récupération de la clé publique (ANON) depuis les variables d'environnement
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Création et exportation du client Supabase
// Ce client sera utilisé partout dans l'application pour interagir avec la base de données
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
