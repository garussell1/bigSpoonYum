import { useNavigate } from 'react-router-dom';
import '../index.css'
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from 'react';






export const RecipeDash = () => {

    const filters = ['all','GF', 'HP', 'V', 'VG', 'DF', 'PF']

    const recipes = [
        {   
            id : 0,
            name: 'Mac and Cheese',
            ingredients : [
                {type : 'macaroni', quantity : '2', unit : 'boxes', price : '12$'}, 
                {type :'cheese', quantity :'3', unit :'lbs', price : '5$'}, 
                {type :'butter',quantity : '17', unit : 'tonnes', price : '560$'},
            ],
            filters : ['GF',],
            instructions : 'take the macaroni and boil it then put the cheese and butter in it and then you boom have macaroni and cheese',
            time: 105,
            numberOfPeople: 203,
        },
        {
            id : 1,
            name: 'Bacon Pepperoni',
            ingredients : [
                {type : 'Bacon', quantity : '12',unit : 'lbs', price : '15$'}, 
                {type :'Pepperoni', quantity :'3', unit :'cups', price : '5$'}, 
                {type :'butter',quantity : '17', unit : 'tonnes', price : '560$'},
            ],
            filters : ['GF', 'HP',],
            instructions : 'boil the pepperoni in butter, and once black, put raw bacon on it and then eat with spoon',
            time: 5,
            numberOfPeople: 10,
        },
        {
            id : 2,
            name: 'Bacon Pepperoni',
            ingredients : [
                {type : 'Bacon', quantity : '12',unit : 'lbs', price : '15$'}, 
                {type :'Pepperoni', quantity :'3', unit :'cups', price : '5$'}, 
                {type :'butter',quantity : '17', unit : 'tonnes', price : '560$'},
            ],
            filters : ['GF', 'HP',],
            instructions : 'boil the pepperoni in butter, and once black, put raw bacon on it and then eat with spoon',
            time: 5,
            numberOfPeople: 10,
        },
        {
            id : 3,
            name: 'Bacon Pepperoni',
            ingredients : [
                {type : 'Bacon', quantity : '12',unit : 'lbs', price : '15$'}, 
                {type :'Pepperoni', quantity :'3', unit :'cups', price : '5$'}, 
                {type :'butter',quantity : '17', unit : 'tonnes', price : '560$'},
            ],
            filters : ['GF', 'HP', 'VG'],
            instructions : 'boil the pepperoni in butter, and once black, put raw bacon on it and then eat with spoon',
            time: 5,
            numberOfPeople: 10,
        },
        {
            id : 4,
            name: 'Bacon Pepperoni',
            ingredients : [
                {type : 'Bacon', quantity : '12',unit : 'lbs', price : '15$'}, 
                {type :'Pepperoni', quantity :'3', unit :'cups', price : '5$'}, 
                {type :'butter',quantity : '17', unit : 'tonnes', price : '560$'},
            ],
            filters : ['GF', 'HP',],
            instructions : 'boil the pepperoni in butter, and once black, put raw bacon on it and then eat with spoon',
            time: 5,
            numberOfPeople: 10,
        },
        {
            id : 5,
            name: 'Bacon Pepperoni',
            ingredients : [
                {type : 'Bacon', quantity : '12',unit : 'lbs', price : '15$'}, 
                {type :'Pepperoni', quantity :'3', unit :'cups', price : '5$'}, 
                {type :'butter',quantity : '17', unit : 'tonnes', price : '560$'},
            ],
            filters : ['GF', 'HP', 'V'],
            instructions : 'boil the pepperoni in butter, and once black, put raw bacon on it and then eat with spoon',
            time: 5,
            numberOfPeople: 10,
        },
        {
            id : 6,
            name: 'Bacon Pepperoni',
            ingredients : [
                {type : 'Bacon', quantity : '12',unit : 'lbs', price : '15$'}, 
                {type :'Pepperoni', quantity :'3', unit :'cups', price : '5$'}, 
                {type :'butter',quantity : '17', unit : 'tonnes', price : '560$'},
            ],
            filters : ['GF', 'HP',],
            instructions : 'boil the pepperoni in butter, and once black, put raw bacon on it and then eat with spoon',
            time: 5,
            numberOfPeople: 10,
        },
        {
            id : 7,
            name: 'Bacon Pepperoni',
            ingredients : [
                {type : 'Bacon', quantity : '12',unit : 'lbs', price : '15$'}, 
                {type :'Pepperoni', quantity :'3', unit :'cups', price : '5$'}, 
                {type :'butter',quantity : '17', unit : 'tonnes', price : '560$'},
            ],
            filters : ['GF', 'HP', 'VG'],
            instructions : 'boil the pepperoni in butter, and once black, put raw bacon on it and then eat with spoon',
            time: 5,
            numberOfPeople: 10,
        },
        {
            id : 8,
            name: 'Bacon Pepperoni',
            ingredients : [
                {type : 'Bacon', quantity : '12',unit : 'lbs', price : '15$'}, 
                {type :'Pepperoni', quantity :'3', unit :'cups', price : '5$'}, 
                {type :'butter',quantity : '17', unit : 'tonnes', price : '560$'},
            ],
            filters : ['HP',],
            instructions : 'boil the pepperoni in butter, and once black, put raw bacon on it and then eat with spoon',
            time: 5,
            numberOfPeople: 10,
        },
        {
            id : 9,
            name: 'Bacon Pepperoni',
            ingredients : [
                {type : 'Bacon', quantity : '12',unit : 'lbs', price : '15$'}, 
                {type :'Pepperoni', quantity :'3', unit :'cups', price : '5$'}, 
                {type :'butter',quantity : '17', unit : 'tonnes', price : '560$'},
            ],
            filters : ['GF', 'HP',],
            instructions : 'boil the pepperoni in butter, and once black, put raw bacon on it and then eat with spoon',
            time: 5,
            numberOfPeople: 50,
        },
        {
            id : 10,
            name: 'Bacon Pepperoni',
            ingredients : [
                {type : 'Bacon', quantity : '12',unit : 'lbs', price : '15$'}, 
                {type :'Pepperoni', quantity :'3', unit :'cups', price : '5$'}, 
                {type :'butter',quantity : '17', unit : 'tonnes', price : '560$'},
            ],
            filters : ['GF', 'HP',],
            instructions : 'boil the pepperoni in butter, and once black, put raw bacon on it and then eat with spoon',
            time: 500,
            numberOfPeople: 10,
        },
        {
            id : 11,
            name: 'Bacon Pepperoni',
            ingredients : [
                {type : 'Bacon', quantity : '12',unit : 'lbs', price : '15$'}, 
                {type :'Pepperoni', quantity :'3', unit :'cups', price : '5$'}, 
                {type :'butter',quantity : '17', unit : 'tonnes', price : '560$'},
            ],
            filters : ['GF', 'HP',],
            instructions : 'boil the pepperoni in butter, and once black, put raw bacon on it and then eat with spoon',
            time: 5,
            numberOfPeople: 11,
        },
        {
            id : 12,
            name: 'Bacon Pepperoni',
            ingredients : [
                {type : 'Bacon', quantity : '12',unit : 'lbs', price : '15$'}, 
                {type :'Pepperoni', quantity :'3', unit :'cups', price : '5$'}, 
                {type :'butter',quantity : '17', unit : 'tonnes', price : '560$'},
            ],
            filters : ['GF', 'HP',],
            instructions : 'boil the pepperoni in butter, and once black, put raw bacon on it and then eat with spoon',
            time: 5,
            numberOfPeople: 10,
        },
        {
            id : 13,
            name: 'Bacon Pepperoni',
            ingredients : [
                {type : 'Bacon', quantity : '12',unit : 'lbs', price : '15$'}, 
                {type :'Pepperoni', quantity :'3', unit :'cups', price : '5$'}, 
                {type :'butter',quantity : '17', unit : 'tonnes', price : '560$'},
            ],
            filters : ['GF', 'HP',],
            instructions : 'boil the pepperoni in butter, and once black, put raw bacon on it and then eat with spoon',
            time: 5,
            numberOfPeople: 13,
        },
    ]
    const {isAuthenticated, user, loginWithRedirect, logout} = useAuth0();
    const navigate = useNavigate();
    const [selectedRecipes, setSelectedRecipes] = useState([]);

    const toggleRecipe = (id) => {
        setSelectedRecipes((prev) =>
        prev.includes(id) ? prev.filter((recipeId) => recipeId !== id) : [...prev, id]
        );
    };

    const [activeFilter, setActiveFilter] = useState("all");

    const filteredRecipes = recipes.filter((recipe) => activeFilter === 'all' || recipe.filters.includes(activeFilter));

    return(
        <div >
            <div className="flex justify-between items-center p-4 page-title">
                <a href='/'>
                    <h1 className=" text-primary text-xl font-bold hover:text-blue-500"> BIG SPOON YUM </h1>
                </a>
                 
                <button
                    className="cosmic-button"
                    onClick={() => navigate("/dashboard")}
                > Dashboard </button>

            </div>
           
            <div className="py-56" >
                <h1 className="font-bold text-4xl ">Recipe time</h1>
                <div className='flex flex-wrap justify-center gap-4 mb-12'>
                    {filters.map((filter, key) => (
                        <button 
                        key={key}
                        className={`px-5 py-2 rounded-full transition-colors duration-300 capitalize
                                    ${activeFilter == filter ? "bg-primary text-primary-foreground" : "bg-secondary/70 text-foreground hover:bd-secondary"}`}
                        onClick={() => setActiveFilter(filter)}                 
                        >
                            {filter}
                        </button>
                    ))}

                </div>
                <div className='py-25 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {filteredRecipes.map((recipe,key) =>(
                        <div 
                        key={key} 
                        onClick={() => toggleRecipe(recipe.id)}
                        className={`group bg-card rounded-lg overflow-hidden shadow-xs card-hover cursor-pointer 
                                    ${selectedRecipes.includes(recipe.id) ? "border-4 border-blue-500" : "border"}`} 
                        > 
                            <div> 
                                <div className='flex flex-wrap gap-2 mb-4'>
                                    <div className="px-36 items-center justify-between">
                                        <h2 className= 'text-2xl font-bold'> {recipe.name}</h2>
                                        {recipe.filters.map((filters, idx) => (
                                            <span key={idx} className='px-2 py-1 text-xs font-medium border rounded-full'> {filters} </span>
                                        ))}
                                    </div>
                                    {recipe.instructions}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            
            </div>
        </div>
    );
}