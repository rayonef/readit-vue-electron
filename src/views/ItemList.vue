<template>
  <div>
    <v-toolbar
      color="teal"
      app
      prominent
      dark
    >
      <!-- <v-toolbar-title>Enter URL</v-toolbar-title> -->
      <v-text-field
        ref="search"
        v-model="search"
        placeholder="Search..."
        append-icon="search"
        solo-inverted
        flat
        class="mr-3"
        hide-details
      />
      <!-- <v-spacer /> -->
      <v-btn icon @click="dialog = true">
        <v-icon>add</v-icon>
      </v-btn>
      <v-dialog v-model="dialog" max-width="350px" persistent>
        <v-card>
          <v-card-text class="pt-3">
            <v-text-field
              v-model="url"
              append-icon="public"
              label="Add URL to read list"
              @keyup.enter="$refs.addItem.click"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :disabled="loading"
              @click="dialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              ref="addItem"
              color="teal"
              class="white--text"
              :loading="loading"
              :disabled="loading || url === ''"
              @click="addItem"
            >
              Add item
              <!-- <v-icon right dark>
                add
              </v-icon> -->
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-content class="no-select">
      <v-list two-line>
        <template v-for="(item, index) in filteredItems">
          <v-list-tile
            :key="index"
            avatar
            ripple
            :class="selectedIndex === index ? 'highlighted' : ''"
            @dblclick="openItem()"
            @click="selectItem(index)"
          >
            <v-list-tile-avatar :tile="true" size="48">
              <img :src="item.screenshot">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title" />
            </v-list-tile-content>
          </v-list-tile>
          <v-divider
            v-if="index + 1 < items.length"
            :key="`${index}a`"
          />
        </template>
      </v-list>
    </v-content>
  </div>
</template>

<script>
/* eslint-disable import/no-extraneous-dependencies */
import { ipcRenderer, shell } from 'electron';
import bus from '@/event';

// const newItem = url => {
//   ipcRenderer.send('new-item', url);
// };

export default {
  name: 'App',
  data() {
    return {
      search: '',
      url: '',
      dialog: false,
      loading: false,
      items: [],
      selectedIndex: 0
    };
  },
  computed: {
    filteredItems() {
      return this.search === ''
        ? this.items
        : this.items.filter(item => item.title.toLowerCase().includes(this.search));
    }
  },
  mounted() {
    ipcRenderer.on('new-item-success', (e, item) => {
      this.url = null;
      this.items.push(item);
      this.saveItems();
      this.loading = false;
      this.dialog = false;
    });

    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') {
        if (this.selectedIndex === this.filteredItems.length - 1) {
          this.selectedIndex = 0;
        } else {
          this.selectedIndex += 1;
        }
      } else if (e.key === 'ArrowUp') {
        if (this.selectedIndex === 0) {
          this.selectedIndex = this.filteredItems.length - 1;
        } else {
          this.selectedIndex -= 1;
        }
      }
    });

    window.deleteItem = index => {
      console.log(index);
      const i = index === -1 ? this.selectedIndex : index;
      this.items.splice(i, 1);
      this.saveItems();
      this.selectedIndex = this.items.length === 0 ? 0 : this.selectedIndex -= 1;
    };

    bus.$on('newItem', () => { this.dialog = true; });

    bus.$on('readItem', () => { if (this.filteredItems.length > 0) this.openItem(); });

    bus.$on('openInBrowser', () => {
      if (this.filteredItems.length > 0 && this.selectedIndex !== -1) {
        shell.openExternal(this.filteredItems[this.selectedIndex].url);
      }
    });

    bus.$on('search', () => { this.$refs.search.focus(); });

    this.items = this.getItems();
  },
  methods: {
    getItems() {
      return JSON.parse(localStorage.getItem('toReadItems')) || [];
    },
    saveItems() {
      localStorage.setItem('toReadItems', JSON.stringify(this.items));
    },
    addItem() {
      this.loading = true;
      // console.log(this.url);
      ipcRenderer.send('new-item', this.url);
    },
    selectItem(index) {
      this.selectedIndex = index;
    },
    openItem() {
      const item = this.filteredItems[this.selectedIndex];
      const index = this.items.findIndex(o => o.title === item.title);
      const readerWinURL = process.env.NODE_ENV === 'development'
        ? `http://localhost:8080/#/about?url=${item.url}&title=${item.title}&index=${index}`
        : `file://${__dirname}/index.html#about?url=${item.url}&title=${item.title}&index=${index}`;
      // const readerWin =
      window.open(readerWinURL, item.title);
    }
  }
};
</script>

<style>
.highlighted {
  background-color: #ddd
}
.no-select {
  -webkit-user-select: none;
}
</style>
