import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Hono } from "npm:hono"
import { cors } from "npm:hono/cors"
import { logger } from "npm:hono/logger"
import { createClient } from "npm:@supabase/supabase-js"
import * as kv from './kv_store.tsx'

const app = new Hono()

// Enable CORS and logging
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}))
app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Helper function to verify user authentication
async function verifyUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1]
  if (!accessToken) {
    return null
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken)
  if (error || !user) {
    console.log('Auth error:', error)
    return null
  }
  
  return user
}

// Initialize storage bucket on startup
const bucketName = 'make-bff97a02-skillswap'
const { data: buckets } = await supabase.storage.listBuckets()
const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
if (!bucketExists) {
  await supabase.storage.createBucket(bucketName, { public: false })
  console.log('Created storage bucket:', bucketName)
}

// Auth routes
app.post('/make-server-bff97a02/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json()
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })

    if (error) {
      console.log('Signup error:', error)
      return c.json({ error: error.message }, 400)
    }

    // Create user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff`,
      bio: '',
      location: '',
      credits: 3, // Starting credits
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    })

    return c.json({ user: data.user })
  } catch (error) {
    console.log('Signup error:', error)
    return c.json({ error: 'Failed to create user' }, 500)
  }
})

// User routes
app.get('/make-server-bff97a02/users/me', async (c) => {
  const user = await verifyUser(c.req.raw)
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  try {
    const userData = await kv.get(`user:${user.id}`)
    if (!userData) {
      return c.json({ error: 'User not found' }, 404)
    }
    return c.json(userData)
  } catch (error) {
    console.log('Get user error:', error)
    return c.json({ error: 'Failed to get user' }, 500)
  }
})

app.put('/make-server-bff97a02/users/me', async (c) => {
  const user = await verifyUser(c.req.raw)
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  try {
    const updates = await c.req.json()
    const currentUser = await kv.get(`user:${user.id}`)
    
    if (!currentUser) {
      return c.json({ error: 'User not found' }, 404)
    }

    const updatedUser = { ...currentUser, ...updates, id: user.id }
    await kv.set(`user:${user.id}`, updatedUser)
    
    return c.json(updatedUser)
  } catch (error) {
    console.log('Update user error:', error)
    return c.json({ error: 'Failed to update user' }, 500)
  }
})

app.get('/make-server-bff97a02/users', async (c) => {
  try {
    const users = await kv.getByPrefix('user:')
    return c.json(users)
  } catch (error) {
    console.log('Get users error:', error)
    return c.json({ error: 'Failed to get users' }, 500)
  }
})

// Skills routes
app.post('/make-server-bff97a02/skills', async (c) => {
  const user = await verifyUser(c.req.raw)
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  try {
    const skillData = await c.req.json()
    const skillId = `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const skill = {
      id: skillId,
      userId: user.id,
      ...skillData,
      createdAt: new Date().toISOString()
    }

    await kv.set(`skill:${skillId}`, skill)
    return c.json(skill)
  } catch (error) {
    console.log('Create skill error:', error)
    return c.json({ error: 'Failed to create skill' }, 500)
  }
})

app.get('/make-server-bff97a02/skills', async (c) => {
  try {
    const skills = await kv.getByPrefix('skill:')
    return c.json(skills)
  } catch (error) {
    console.log('Get skills error:', error)
    return c.json({ error: 'Failed to get skills' }, 500)
  }
})

app.get('/make-server-bff97a02/skills/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const allSkills = await kv.getByPrefix('skill:')
    const userSkills = allSkills.filter(skill => skill.userId === userId)
    return c.json(userSkills)
  } catch (error) {
    console.log('Get user skills error:', error)
    return c.json({ error: 'Failed to get user skills' }, 500)
  }
})

// Sessions routes
app.post('/make-server-bff97a02/sessions', async (c) => {
  const user = await verifyUser(c.req.raw)
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  try {
    const sessionData = await c.req.json()
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const session = {
      id: sessionId,
      studentId: user.id,
      ...sessionData,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    }

    // Deduct credits from student
    const student = await kv.get(`user:${user.id}`)
    if (!student || student.credits < sessionData.credits) {
      return c.json({ error: 'Insufficient credits' }, 400)
    }

    student.credits -= sessionData.credits
    await kv.set(`user:${user.id}`, student)

    // Add credits to teacher (when session is completed)
    const teacher = await kv.get(`user:${sessionData.teacherId}`)
    if (teacher) {
      teacher.credits += sessionData.credits
      await kv.set(`user:${sessionData.teacherId}`, teacher)
    }

    await kv.set(`session:${sessionId}`, session)

    // Record transactions
    const studentTransactionId = `transaction_${Date.now()}_student`
    const studentTransaction = {
      id: studentTransactionId,
      userId: user.id,
      type: 'spent',
      amount: sessionData.credits,
      description: `Booked session: ${sessionData.skillName || 'Unknown skill'}`,
      date: new Date().toISOString(),
      sessionId: sessionId
    }
    await kv.set(`transaction:${studentTransactionId}`, studentTransaction)

    const teacherTransactionId = `transaction_${Date.now()}_teacher`
    const teacherTransaction = {
      id: teacherTransactionId,
      userId: sessionData.teacherId,
      type: 'earned',
      amount: sessionData.credits,
      description: `Taught session: ${sessionData.skillName || 'Unknown skill'}`,
      date: new Date().toISOString(),
      sessionId: sessionId
    }
    await kv.set(`transaction:${teacherTransactionId}`, teacherTransaction)

    return c.json(session)
  } catch (error) {
    console.log('Create session error:', error)
    return c.json({ error: 'Failed to create session' }, 500)
  }
})

app.get('/make-server-bff97a02/sessions', async (c) => {
  const user = await verifyUser(c.req.raw)
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  try {
    const allSessions = await kv.getByPrefix('session:')
    const userSessions = allSessions.filter(session => 
      session.teacherId === user.id || session.studentId === user.id
    )
    return c.json(userSessions)
  } catch (error) {
    console.log('Get sessions error:', error)
    return c.json({ error: 'Failed to get sessions' }, 500)
  }
})

// Transactions routes
app.get('/make-server-bff97a02/transactions', async (c) => {
  const user = await verifyUser(c.req.raw)
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  try {
    const allTransactions = await kv.getByPrefix('transaction:')
    const userTransactions = allTransactions.filter(transaction => transaction.userId === user.id)
    return c.json(userTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
  } catch (error) {
    console.log('Get transactions error:', error)
    return c.json({ error: 'Failed to get transactions' }, 500)
  }
})

// Health check
app.get('/make-server-bff97a02/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Initialize demo data
async function initializeDemoData() {
  try {
    // Check if demo users exist
    const existingUsers = await kv.getByPrefix('user:')
    
    if (existingUsers.length === 0) {
      console.log('Initializing demo data...')
      
      // Create demo users
      const demoUsers = [
        {
          id: 'demo1',
          name: 'Alex Rodriguez',
          email: 'alex@demo.com',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          bio: 'Full-stack developer with 8 years of experience. Love teaching coding to beginners!',
          location: 'San Francisco, CA',
          credits: 12,
          rating: 4.9,
          reviewCount: 47,
          createdAt: new Date().toISOString()
        },
        {
          id: 'demo2',
          name: 'Sarah Chen',
          email: 'sarah@demo.com',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b352a3f5?w=150&h=150&fit=crop&crop=face',
          bio: 'Professional guitarist and music teacher. I teach various styles from classical to rock.',
          location: 'Austin, TX',
          credits: 8,
          rating: 4.8,
          reviewCount: 32,
          createdAt: new Date().toISOString()
        },
        {
          id: 'demo3',
          name: 'Maya Patel',
          email: 'maya@demo.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
          bio: 'Certified yoga instructor specializing in Hatha and Vinyasa flow.',
          location: 'Los Angeles, CA',
          credits: 5,
          rating: 5.0,
          reviewCount: 28,
          createdAt: new Date().toISOString()
        }
      ]
      
      // Save demo users
      for (const user of demoUsers) {
        await kv.set(`user:${user.id}`, user)
      }
      
      // Create demo skills
      const demoSkills = [
        {
          id: 'skill_demo1',
          userId: 'demo1',
          name: 'React Development',
          category: 'Programming',
          level: 'Expert',
          description: 'Learn modern React with hooks, context, and best practices',
          creditsPerHour: 1,
          availability: ['Monday 9-5', 'Wednesday 9-5', 'Friday 9-5'],
          createdAt: new Date().toISOString()
        },
        {
          id: 'skill_demo2',
          userId: 'demo2',
          name: 'Guitar Lessons',
          category: 'Music',
          level: 'Expert',
          description: 'Acoustic and electric guitar for all levels',
          creditsPerHour: 1,
          availability: ['Tuesday 2-8', 'Thursday 2-8', 'Saturday 10-6'],
          createdAt: new Date().toISOString()
        },
        {
          id: 'skill_demo3',
          userId: 'demo3',
          name: 'Hatha Yoga',
          category: 'Fitness',
          level: 'Expert',
          description: 'Gentle yoga practice focusing on breathing and alignment',
          creditsPerHour: 1,
          availability: ['Monday 6-9', 'Wednesday 6-9', 'Sunday 8-12'],
          createdAt: new Date().toISOString()
        }
      ]
      
      // Save demo skills
      for (const skill of demoSkills) {
        await kv.set(`skill:${skill.id}`, skill)
      }
      
      console.log('Demo data initialized successfully')
    }
  } catch (error) {
    console.log('Error initializing demo data:', error)
  }
}

console.log('SkillSwap server starting...')
await initializeDemoData()
serve(app.fetch)