<?php
// src/Sdz/BlogBundle/DataFixtures/ORM/Categories.php

namespace Sdz\BlogBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use RSHub\MarketplaceBundle\Entity\Category;

class Category implements FixtureInterface {
	// Dans l'argument de la méthode load, l'objet $manager est l'EntityManager
	public function load(ObjectManager $manager) {
		// Liste des noms de catégorie à ajouter
		$noms = array('Cheats', 'Decoration', 'Gameplay', 'World', 'Mobs',
				'UI', 'Utilities', 'Performance', 'Texture Pack', 'API');

		foreach ($noms as $i => $nom) {
			// On crée la catégorie
			$liste_categories[$i] = new Category();
			$liste_categories[$i]->setNom($nom);

			// On la persiste
			$manager->persist($liste_categories[$i]);
		}

		// On déclenche l'enregistrement
		$manager->flush();
	}
}
