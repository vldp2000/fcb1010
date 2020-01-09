<template>
 <v-container grid-list-md text-md-center fluid fill-height class="darkBackgroud">

      <v-row no-gutters >

          <!-- <div class='rotatedLabel'>
            <b>Program A</b>
          </div> -->

          <div class="progLabel">
            <h1>A</h1>
          </div>

        <v-col md3 d-flex>
          <v-card class="pa-1" dark >
            <preset imageURL='/img/image_01.3f6122bf.png'/>
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>

      </v-row>

      <v-row md12 no-gutters>

          <div class="progLabelSelected">
            <h1>B</h1>
          </div>

        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>

      </v-row>

      <v-row md12 no-gutters>
          <div class="progLabel">
            <h1>C</h1>
          </div>

        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
      </v-row>

      <v-row md12 no-gutters>
          <div class="progLabel">
            <h1>D</h1>
          </div>
        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
        <v-col md3 d-flex>
          <v-card  class="pa-1" dark >
            <preset  />
          </v-card>
        </v-col>
      </v-row>

    </v-container>
</template>

<style scoped>
  .preset {
    margin: 5px;
  }
  .v-card {
    color: rgba(36, 34, 34, 0.856);
    padding: 2px;
  }
  .darkBackgroud {
    background-color:rgba(36, 34, 34, 0.856)
  }

.progLabel {
  text-align: center;
  text-justify: auto;
  color:black;
  border: 2px solid black;
  border-radius: 10px;

  width: 40px;
  height: 50px;
  /* margin: 50px, 10px, 0px, -10px; */
  margin-top: 50px;
  margin-left: -10px;
  margin-right: 2px;
  padding: 0px;
}

.progLabelSelected {
  text-align: center;
  text-justify: auto;
  color: blue;
  border: 2px solid blue;
  border-radius: 10px;

  width: 40px;
  height: 50px;
  /* margin: 50px, 10px, 0px, -10px; */
  margin-top: 50px;
  margin-left: -10px;
  margin-right: 2px;
  padding: 0px;
}

</style>
