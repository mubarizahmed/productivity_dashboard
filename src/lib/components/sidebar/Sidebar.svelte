<script lang='ts'>
  import Icon from "@iconify/svelte";
  import logo from "$lib/assets/public/logo.png";
  import { page } from "$app/stores";
  import { supabaseClient } from "$lib/supabaseClient";
</script>

<!-- sidebar -->
<div class='py-4 flex flex-col w-12 h-screen bg-gray-100 justify-between fixed bg-rich-black-2 border-r-2 border-space-cadet'>
  <!-- pd logo wrapper -->
  <div class='flex justify-center items-center object-contain aspect-square p-1'>
    <img class='' src={logo} alt="logo"/>
  </div>
  <!-- sidebar items -->
  <div class='flex flex-col items-center justify-center h-16 '>
    <div class='flex items-center justify-center w-8 h-8 hover:bg-gray-300 rounded-full'>
      <Icon icon="ic:round-home" color='#8391B2ff' class='w-6 h-6 text-gray-500' />
    </div>
  </div>
  <!-- account -->
  <div class='flex flex-col items-center justify-center gap-2'>
    <div class='flex items-center justify-center w-8 h-8 rounded-full'>
      <img class='w-8 h-8 rounded-full' src={$page.data.session?.user?.user_metadata?.avatar_url} alt="user" />
      <!-- <Icon icon='mdi:user-circle' color='#8391B2ff' class='w-6 h-6 text-gray-500' /> -->
    </div>
    <button on:click={()=> supabaseClient.auth.signOut()} class='flex items-center justify-center w-8 h-8 hover:bg-gray-300 rounded-full'>
      <Icon icon='ic:baseline-log-out'  color="#d1453b" class='w-6 h-6' />
    </button>
  </div>
</div>