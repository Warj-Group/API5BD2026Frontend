<template>
  <div class="min-h-screen bg-[#F8F9FA] flex items-center justify-center relative overflow-hidden font-sans">
    
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center select-none">
      <span class="text-[800px] font-black text-[#210B45]">W</span>
    </div>

    <UCard 
      class="w-full max-w-sm z-10 border-none shadow-xl bg-[#F1F5F9]"
      :ui="{ body: { padding: 'p-10' } }"
    >
      <div class="flex justify-center mb-10">
        <img src="/warj_logo.png" class="h-32 w-auto" alt="WARJ" >
      </div>

      <form class="w-full space-y-4" @submit.prevent="navigateTo('/dashboard')">
        
        <UFormField name="email" class="w-full flex flex-col">
          <template #label>
            <div class="w-full text-left text-[#210B45] font-bold text-[12px] mb-1 tracking-widest block w-full">
              Email address:
            </div>
          </template>
          <UInput 
            placeholder="email@exemplo.com" 
            size="lg"
            icon="i-lucide-mail"
            variant="outline"
            class="w-full [&_input]:text-left"
          />
        </UFormField>

        <UFormField name="password" class="w-full flex flex-col">
          <template #label>
            <div class="w-full text-left text-[#210B45] font-bold text-[12px] mb-1 tracking-widest block w-full">
              Password:
            </div>
          </template>
          <UInput 
            type="password" 
            placeholder="Type your password here..." 
            size="lg"
            icon="i-lucide-lock"
            variant="outline"
            class="w-full [&_input]:text-left"
          />
        </UFormField>
        
        <div class="flex justify-end w-full pt-2">
          <ULink class="text-[10px] font-bold text-[#6C757D] hover:text-[#6F42C1] transition-colors tracking-widest">
            Forgot password?
          </ULink>
        </div>

        <UButton 
          type="submit"
          block 
          label="LOG IN" 
          size="lg"
          class="bg-[#00D9A6] hover:bg-[#00D9A6]/90 text-[#210B45] font-black shadow-lg shadow-[#00D9A6]/20 py-3 mt-6 rounded-md transition-transform active:scale-95" 
        />
      </form>
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })
</script>